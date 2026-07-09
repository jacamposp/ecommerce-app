'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart-store'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    useCartStore.setState({ items: [] })
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-white">
      <div className="hero-content-animate flex flex-col items-center">
        <div className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <CheckCircle2 className="size-8 text-white" strokeWidth={1.5} />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Payment successful</p>
        <h1
          className="mt-2 text-4xl uppercase text-white md:text-5xl"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
        >
          Order confirmed
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
          Thanks for your purchase. A confirmation email is on its way with your order details.
        </p>

        {sessionId && (
          <p className="mt-6 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-white/40">
            Ref {sessionId.slice(-12)}
          </p>
        )}

        <Link
          href="/products"
          className="mt-10 inline-flex h-12 items-center rounded-full bg-white px-8 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-white/90"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
