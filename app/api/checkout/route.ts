import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { calculateShipping } from '@/lib/shipping'
import { auth } from '@/auth'
import type { Prisma, Product } from '@/generated/prisma/client'
import { SIZES, STOCK_FIELD, type Size } from '@/lib/types'

type CheckoutBody = {
  items: { productId: string; size: Size; quantity: number }[]
}

type OrderItemInput = { productId: string; size: Size; quantity: number; price: Product['price'] }

class InsufficientStockError extends Error {
  constructor(public productName: string) {
    super(`Insufficient stock for ${productName}`)
  }
}

export async function POST(req: Request) {
  try {
    const authSession = await auth()
    const body = (await req.json()) as CheckoutBody

    if (!body.items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // 1. Load real products from DB (never trust client price)
    const productIds = body.items.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    // The cart keys items by (productId, size), so the same product can appear
    // in multiple size lines — compare against the unique product ids.
    const uniqueProductIds = new Set(productIds)
    if (products.length !== uniqueProductIds.size) {
      return NextResponse.json({ error: 'Some products are invalid' }, { status: 400 })
    }

    const productById = Object.fromEntries(products.map((p) => [p.id, p]))

    // 2. Validate stock + build line items
    let total = 0
    const orderItemsData: OrderItemInput[] = []

    for (const item of body.items) {
      const product = productById[item.productId]
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 400 })
      }
      if (!SIZES.includes(item.size)) {
        return NextResponse.json({ error: `Invalid size for ${product.name}` }, { status: 400 })
      }
      if (product[STOCK_FIELD[item.size]] < item.quantity) {
        return NextResponse.json(
          { error: `Not enough stock for ${product.name} (${item.size})` },
          { status: 400 },
        )
      }

      const unitPrice = Number(product.price)
      total += unitPrice * item.quantity

      orderItemsData.push({
        productId: product.id,
        size: item.size,
        quantity: item.quantity,
        price: product.price, // Prisma Decimal
      })
    }

    // 3. Compute shipping server-side (never trust client)
    const shipping = calculateShipping(total)
    const totalWithShipping = total + shipping

    // 4. Atomically reserve stock and create the pending order. `updateMany`
    // with a `[stock<Size>]: { gte }` guard (instead of read-then-write) means
    // concurrent checkouts for the same product+size serialize at the
    // database's row lock, so two buyers can never both reserve the last unit
    // of a size. If any item fails, the whole transaction rolls back and
    // nothing is reserved.
    let order
    try {
      order = await prisma.$transaction(async (tx) => {
        for (const item of body.items) {
          const field = STOCK_FIELD[item.size]
          const reserved = await tx.product.updateMany({
            where: { id: item.productId, [field]: { gte: item.quantity } } as Prisma.ProductWhereInput,
            data: { [field]: { decrement: item.quantity } } as Prisma.ProductUpdateManyMutationInput,
          })
          if (reserved.count === 0) {
            throw new InsufficientStockError(productById[item.productId]?.name ?? item.productId)
          }
        }

        return tx.order.create({
          data: {
            status: 'pending',
            total: totalWithShipping,
            userId: authSession?.user?.id,
            items: {
              create: orderItemsData,
            },
          },
          include: { items: true },
        })
      })
    } catch (error) {
      if (error instanceof InsufficientStockError) {
        return NextResponse.json({ error: `Not enough stock for ${error.productName}` }, { status: 400 })
      }
      throw error
    }

    // 5. Create Stripe Checkout Session
    const lineItems = order.items.map((item) => {
      const product = productById[item.productId]
      return {
        quantity: item.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(Number(item.price) * 100), // cents
          product_data: {
            name: `${product.name} — ${item.size}`,
            images: product.image ? [product.image] : undefined,
          },
        },
      }
    })

    if (shipping > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(shipping * 100), // cents
          product_data: {
            name: 'Shipping',
            images: undefined,
          },
        },
      })
    }

    let session
    try {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?order_id=${order.id}`,
        metadata: {
          orderId: order.id,
        },
        line_items: lineItems,
      })
    } catch (error) {
      // No Stripe session was ever created for this order, so nothing will
      // ever fire a cancel/expiry event to release the reservation above —
      // release it here instead of leaving the stock stuck as reserved.
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { [STOCK_FIELD[item.size as Size]]: { increment: item.quantity } } as Prisma.ProductUpdateInput,
          })
        }
        await tx.order.update({ where: { id: order.id }, data: { status: 'cancelled' } })
      })
      throw error
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
