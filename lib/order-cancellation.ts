import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { STOCK_FIELD, type Size } from '@/lib/types'

/**
 * Cancels a pending order and releases the stock it reserved at checkout.
 *
 * The `status: 'pending'` guard on the `updateMany` makes the whole thing
 * safe to call more than once (e.g. the cancel page and the
 * `checkout.session.expired` webhook both firing for the same order): only
 * whichever call actually flips the row from `pending` restores stock, so
 * it's never double-released, and an order that's already `paid` is never
 * clobbered.
 */
export async function cancelPendingOrder(orderId: string) {
  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })
    if (!order || order.status !== 'pending') return

    const cancelled = await tx.order.updateMany({
      where: { id: orderId, status: 'pending' },
      data: { status: 'cancelled' },
    })
    if (cancelled.count === 0) return

    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { [STOCK_FIELD[item.size as Size]]: { increment: item.quantity } } as Prisma.ProductUpdateInput,
      })
    }
  })
}
