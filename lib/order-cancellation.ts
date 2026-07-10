import { prisma } from '@/lib/prisma'

/**
 * Only flips orders that are still `pending` — never clobbers an order that
 * has already been paid/shipped/cancelled (e.g. a race between the webhook
 * marking it paid and the user hitting the cancel/expiry path).
 */
export async function cancelPendingOrder(orderId: string) {
  await prisma.order.updateMany({
    where: { id: orderId, status: 'pending' },
    data: { status: 'cancelled' },
  })
}
