import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  shipped: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  cancelled: 'bg-destructive/10 text-destructive',
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true, items: true },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">{orders.length} total</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => {
              const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
              return (
                <tr key={order.id}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                      #{order.id.slice(-8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.user?.name ?? order.user?.email ?? 'Guest'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </td>
                  <td className="px-4 py-3 tabular-nums">$ {Number(order.total).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                        STATUS_STYLES[order.status] ?? 'bg-muted text-muted-foreground',
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(order.createdAt)}
                  </td>
                </tr>
              )
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
