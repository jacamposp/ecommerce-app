import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">404</p>
      <h1
        className="mt-2 text-4xl uppercase text-white md:text-5xl"
        style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
      >
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center rounded-full bg-white px-8 text-xs font-semibold uppercase tracking-wider text-black transition-all hover:bg-white/90"
      >
        Back to home
      </Link>
    </main>
  )
}
