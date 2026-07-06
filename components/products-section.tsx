import { PRODUCTS } from '@/lib/products'
import ProductCard from '@/components/product-card'

export default function ProductsSection() {
  return (
    <section id="products" className="relative bg-[#0a0a0a] px-6 py-20 md:px-10 md:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/40 to-transparent"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-3 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">2026 Collection</p>
            <h2
              className="mt-2 text-4xl uppercase text-white md:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
            >
              Featured Kits
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/50 md:text-base">
            Official-inspired jerseys from Europe&apos;s elite clubs. Engineered for matchday, built for supporters.
          </p>
        </div>

        {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div> */}
      </div>
    </section>
  )
}
