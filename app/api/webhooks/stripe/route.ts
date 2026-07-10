import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { cancelPendingOrder } from '@/lib/order-cancellation'

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

    // Stock was already reserved atomically when the order was created (see
    // app/api/checkout/route.ts), so this only needs to flip the order to
    // paid — not re-validate or decrement stock again. The `status: 'pending'`
    // guard makes this idempotent if Stripe retries the webhook, and avoids
    // clobbering an order that was already cancelled (e.g. stock released
    // back to other buyers) out from under it.
    const updated = await prisma.order.updateMany({
      where: { id: orderId, status: 'pending' },
      data: {
        status: 'paid',
        stripePaymentId: paymentIntentId ?? session.id,
      },
    })

    if (updated.count === 0) {
      console.error(
        `checkout.session.completed for order ${orderId}, but it was no longer pending (already paid or cancelled) — needs manual review.`,
      )
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object
    const orderId = session.metadata?.orderId

    if (orderId) {
      await cancelPendingOrder(orderId)
    }
  }

  return NextResponse.json({ received: true })
}