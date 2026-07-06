import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ProductCard from '@/components/product-card'
import type { Product } from '@/generated/prisma/client'

const categories = ['All', 'Home', 'Away', 'Third']

export default async function ProductsPage() {
  const products: Product[] = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/60 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        {/* Page header */}
        <header className="mb-12 md:mb-16">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/40 transition-colors hover:text-white/70"
          >
            ← Back
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">2026 Collection</p>
              <h1
                className="mt-2 text-4xl uppercase text-white md:text-5xl lg:text-6xl"
                style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
              >
                All Kits
              </h1>
              <p className="mt-3 text-sm text-white/40">{products.length} products</p>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-white/50 md:text-base">
              Browse every official-inspired jersey in the collection. Filter by kit type or sort to find your matchday
              fit.
            </p>
          </div>
        </header>

        {/* Filters & sort — UI only */}
        <div className="mb-10 flex flex-col gap-4 border-b border-white/8 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={category}
                type="button"
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  index === 0
                    ? 'border border-white/30 bg-white/10 text-white'
                    : 'border border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="flex items-center gap-2 self-start rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 transition-colors hover:border-white/30 hover:text-white sm:self-auto"
          >
            Sort: Featured
            <span className="text-white/40" aria-hidden>
              ▾
            </span>
          </button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </main>
  )
}
