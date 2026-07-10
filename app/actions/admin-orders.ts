'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/require-admin'
import { ORDER_STATUSES } from '@/lib/order-statuses'
import { cancelPendingOrder } from '@/lib/order-cancellation'

export type OrderStatusFormState = { error: string } | undefined

export async function updateOrderStatus(
  orderId: string,
  _prevState: OrderStatusFormState,
  formData: FormData,
): Promise<OrderStatusFormState> {
  await requireAdmin()

  const status = String(formData.get('status') ?? '')
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    return { error: 'Invalid status.' }
  }

  const order = await prisma.order.findUnique({ where: { id: orderId }, select: { status: true } })
  if (!order) return { error: 'Order not found.' }

  if (status === 'cancelled' && order.status === 'pending') {
    // Releases the stock this order reserved at checkout.
    await cancelPendingOrder(orderId)
  } else {
    await prisma.order.update({ where: { id: orderId }, data: { status } })
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/account/orders')
  return undefined
}
