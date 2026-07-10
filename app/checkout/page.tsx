'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, ShieldCheck, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'
import { Button } from '@/components/ui/button'
import { FREE_SHIPPING_THRESHOLD, calculateShipping } from '@/lib/shipping'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = calculateShipping(subtotal)
  const freeShipping = shipping === 0
  const total = subtotal + shipping

  async function handleCheckout() {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setLoading(false)
      setError(data.error ?? 'Checkout failed')
      return
    }

    window.location.href = data.url // redirect to Stripe
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-white">
        <div className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/3">
          <ShoppingBag className="size-7 text-white/30" strokeWidth={1.5} />
        </div>
        <h1
          className="mt-6 text-2xl uppercase text-white"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
        >
          Your bag is empty
        </h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/40">
          Add a jersey to your bag before heading to checkout.
        </p>
        <Button
          className="mt-8 h-12 rounded-full bg-white px-8 text-sm font-semibold uppercase tracking-wider text-black hover:bg-white/90"
          onClick={() => router.push('/products')}
        >
          Shop kits
        </Button>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/60 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/40 transition-colors hover:text-white/70"
        >
          ← Continue shopping
        </Link>

        <header className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Secure checkout</p>
          <h1
            className="mt-2 text-4xl uppercase text-white md:text-5xl"
            style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
          >
            Checkout
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* Order items */}
          <div>
            <h2 className="border-b border-white/8 pb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Order ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </h2>

            <ul>
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 border-b border-white/8 py-5">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-white/3">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/20">
                        <ShoppingBag className="size-6" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold uppercase tracking-wide text-white">
                          {item.productName}
                        </p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">
                          Qty {item.quantity}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold tabular-nums text-white">
                        $ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order summary */}
          <aside className="h-fit rounded-2xl border border-white/8 bg-white/3 p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Summary</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between text-white/70">
                <span>Subtotal</span>
                <span className="tabular-nums text-white">$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>Shipping</span>
                <span className="tabular-nums text-white">
                  {shipping === 0 ? 'Free' : `$ ${shipping.toFixed(2)}`}
                </span>
              </div>
              {!freeShipping && (
                <p className="text-xs text-white/40">
                  Add{' '}
                  <span className="font-semibold text-white/70">
                    $ {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}
                  </span>{' '}
                  more for free shipping.
                </p>
              )}
              <p className="text-xs text-white/35">Taxes calculated at checkout.</p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Total</span>
              <span className="text-lg font-bold tabular-nums text-white">$ {total.toFixed(2)}</span>
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {error}
              </p>
            )}

            <Button
              className="mt-6 h-12 w-full rounded-full bg-white text-sm font-semibold uppercase tracking-wider text-black hover:bg-white/90"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Redirecting…
                </span>
              ) : (
                'Pay with Stripe'
              )}
            </Button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-white/35">
              <ShieldCheck className="size-3.5" strokeWidth={1.75} />
              Payments are securely processed by Stripe
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}
