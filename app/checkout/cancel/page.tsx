import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-white">
      <div className="hero-content-animate flex flex-col items-center">
        <div className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <XCircle className="size-8 text-white" strokeWidth={1.5} />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Payment cancelled</p>
        <h1
          className="mt-2 text-4xl uppercase text-white md:text-5xl"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
        >
          Checkout cancelled
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
          Your order was not completed and you have not been charged. Your cart is still saved if you&apos;d like to try again.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/checkout"
            className="inline-flex h-12 items-center rounded-full bg-white px-8 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-white/90"
          >
            Return to checkout
          </Link>
          <Link
            href="/products"
            className="inline-flex h-12 items-center rounded-full border border-white/10 px-8 text-xs font-semibold uppercase tracking-wider text-white/70 transition-all hover:border-white/30 hover:text-white"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
