import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderStatusForm } from '@/components/admin/order-status-form'

type Props = { params: Promise<{ id: string }> }

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: { include: { product: true } } },
  })
  if (!order) notFound()

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/orders" className="text-sm text-muted-foreground hover:underline">
          ← Orders
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Order #{order.id.slice(-8)}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Placed {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(order.createdAt)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                      {item.product.image && (
                        <Image src={item.product.image} alt={item.product.name} fill sizes="56px" className="object-cover object-top" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium tabular-nums">
                      $ {(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm font-medium">Total</span>
                <span className="text-lg font-semibold tabular-nums">$ {Number(order.total).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{order.user?.name ?? 'Guest'}</p>
              <p className="text-muted-foreground">{order.user?.email ?? '—'}</p>
              {order.stripePaymentId && (
                <p className="mt-3 text-xs text-muted-foreground">Stripe: {order.stripePaymentId}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusForm orderId={order.id} currentStatus={order.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
