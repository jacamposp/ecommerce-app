'use client'

import { useActionState } from 'react'
import { updateOrderStatus, type OrderStatusFormState } from '@/app/actions/admin-orders'
import { ORDER_STATUSES } from '@/lib/order-statuses'
import { Button } from '@/components/ui/button'

export function OrderStatusForm({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [state, action, pending] = useActionState<OrderStatusFormState, FormData>(
    (prevState, formData) => updateOrderStatus(orderId, prevState, formData),
    undefined,
  )

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="rounded-md border border-input bg-transparent px-3 py-2 text-sm capitalize outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status} className="capitalize">
              {status}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? 'Updating…' : 'Update status'}
      </Button>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  )
}
