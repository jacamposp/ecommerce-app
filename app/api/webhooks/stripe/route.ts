import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderId = session.metadata?.orderId
    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }

    // Transaction: mark paid + decrement stock
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })

      if (!order || order.status === 'paid') return

      for (const item of order.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } })
        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`)
        }
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'paid',
          stripePaymentId: paymentIntentId ?? session.id,
        },
      })
    })
  }

  return NextResponse.json({ received: true })
}