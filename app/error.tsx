'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-white">
      <div className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <AlertTriangle className="size-8 text-white" strokeWidth={1.5} />
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Error</p>
      <h1
        className="mt-2 text-4xl uppercase text-white md:text-5xl"
        style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
      >
        Something went wrong
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
        An unexpected error occurred. You can try again, or head back to the homepage.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex h-12 items-center rounded-full bg-white px-8 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-white/90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-12 items-center rounded-full border border-white/10 px-8 text-xs font-semibold uppercase tracking-wider text-white/70 transition-all hover:border-white/30 hover:text-white"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
