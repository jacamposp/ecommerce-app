import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PackageOpen, ShoppingBag } from 'lucide-react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { signOutAction } from '@/app/actions/auth'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  pending: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  paid: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  shipped: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  cancelled: 'border-red-400/30 bg-red-400/10 text-red-300',
}

export default async function OrderHistoryPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16 text-white md:px-10 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/40 transition-colors hover:text-white/70"
        >
          ← Continue shopping
        </Link>

        <header className="mb-12 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              {session.user.name}
            </p>
            <h1
              className="mt-2 text-4xl uppercase text-white md:text-5xl"
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
            >
              Order history
            </h1>
          </div>

          <form action={signOutAction}>
            <button
              type="submit"
              className="h-10 shrink-0 rounded-full border border-white/15 px-5 text-xs font-semibold uppercase tracking-wider text-white/60 transition-all hover:border-white/30 hover:text-white"
            >
              Sign out
            </button>
          </form>
        </header>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-white/8 bg-white/3 px-6 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/3">
              <PackageOpen className="size-7 text-white/30" strokeWidth={1.5} />
            </div>
            <p
              className="mt-6 text-xl uppercase text-white"
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
            >
              No orders yet
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/40">
              Your past orders will show up here once you make your first purchase.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-6 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-white/90"
            >
              Shop all kits
            </Link>
          </div>
        ) : (
          <ul className="space-y-6">
            {orders.map((order) => {
              const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
              return (
                <li key={order.id} className="rounded-2xl border border-white/8 bg-white/3 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                        Order #{order.id.slice(-8)}
                      </p>
                      <p className="mt-1 text-xs text-white/40">
                        {new Intl.DateTimeFormat('en-US', {
                          dateStyle: 'medium',
                        }).format(order.createdAt)}{' '}
                        · {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider',
                        STATUS_STYLES[order.status] ?? 'border-white/15 bg-white/5 text-white/60',
                      )}
                    >
                      {order.status}
                    </span>
                  </div>

                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id} className="flex gap-4 border-b border-white/8 py-4 last:border-b-0">
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-white/3">
                          {item.product.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              sizes="64px"
                              className="object-cover object-top"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-white/20">
                              <ShoppingBag className="size-5" strokeWidth={1.5} />
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold uppercase tracking-wide text-white">
                              {item.product.name}
                            </p>
                            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">
                              Size {item.size} · Qty {item.quantity}
                            </p>
                          </div>
                          <p className="shrink-0 text-sm font-bold tabular-nums text-white">
                            $ {(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Total</span>
                    <span className="text-lg font-bold tabular-nums text-white">
                      $ {Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}
