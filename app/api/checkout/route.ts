import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

type CheckoutBody = {
  items: { productId: string; quantity: number }[]
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody

    if (!body.items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // 1. Load real products from DB (never trust client price)
    const productIds = body.items.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    if (products.length !== body.items.length) {
      return NextResponse.json({ error: 'Some products are invalid' }, { status: 400 })
    }

    const productById = Object.fromEntries(products.map((p) => [p.id, p]))

    // 2. Validate stock + build line items
    let total = 0
    const orderItemsData = []

    for (const item of body.items) {
      const product = productById[item.productId]
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 400 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 })
      }

      const unitPrice = Number(product.price)
      total += unitPrice * item.quantity

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price, // Prisma Decimal
      })
    }

    // 3. Create pending order in DB
    const order = await prisma.order.create({
      data: {
        status: 'pending',
        total,
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    })

    // 4. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?order_id=${order.id}`,
      metadata: {
        orderId: order.id,
      },
      line_items: order.items.map((item) => {
        const product = productById[item.productId]
        return {
          quantity: item.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(Number(item.price) * 100), // cents
            product_data: {
              name: product.name,
              images: product.image ? [product.image] : undefined,
            },
          },
        }
      }),
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
