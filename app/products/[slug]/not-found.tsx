import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-white">
      <h1 className="text-4xl uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
        Kit not found
      </h1>
      <p className="mt-3 text-sm text-white/50">This product may have been removed.</p>
      <Link
        href="/products"
        className="mt-8 rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-wider hover:border-white/40"
      >
        Browse all kits
      </Link>
    </main>
  )
}
