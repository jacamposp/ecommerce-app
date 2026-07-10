import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboardPage() {
  const [productCount, lowStockCount, orderCount, pendingOrderCount, revenueAgg, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.aggregate({ where: { status: { in: ['paid', 'shipped'] } }, _sum: { total: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: true },
    }),
  ])

  const stats = [
    { label: 'Products', value: productCount, href: '/admin/products' },
    { label: 'Low stock (≤5)', value: lowStockCount, href: '/admin/products' },
    { label: 'Orders', value: orderCount, href: '/admin/orders' },
    { label: 'Pending orders', value: pendingOrderCount, href: '/admin/orders' },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revenue (paid + shipped): $ {Number(revenueAgg._sum.total ?? 0).toFixed(2)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm font-normal text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold">{stat.value}</CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent orders</CardTitle>
          <Link href="/admin/orders" className="text-sm underline underline-offset-4">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-3 text-sm">
                  <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                    #{order.id.slice(-8)} · {order.user?.name ?? order.user?.email ?? 'Guest'}
                  </Link>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground capitalize">{order.status}</span>
                    <span className="font-medium tabular-nums">$ {Number(order.total).toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
