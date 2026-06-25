import { PRODUCTS } from '@/lib/products'

export default function ProductsSection() {
  return (
    <section id="products" className="relative bg-[#0a0a0a] px-6 py-20 md:px-10 md:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent"
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {PRODUCTS.map((product) => (
            <article
              key={product.name}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] transition-all duration-300 hover:border-white/15 hover:bg-white/[0.06]"
            >
              <div
                className="relative aspect-[3/4] overflow-hidden"
                style={{ backgroundColor: product.bg }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-40"
                  style={{
                    background: `radial-gradient(circle at 50% 20%, ${product.accent}44 0%, transparent 60%)`,
                  }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.src}
                  alt={product.name}
                  className="relative z-10 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span
                  className="absolute bottom-3 right-3 z-20 rounded-full px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-sm"
                  style={{ backgroundColor: `${product.accent}33`, border: `1px solid ${product.accent}55` }}
                >
                  #{product.number}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: product.accent }}
                >
                  {product.club}
                </p>
                <h3 className="mt-1 text-sm font-semibold uppercase tracking-wide text-white">{product.name}</h3>
                <p className="mt-1 text-xs text-white/40">{product.season} Season</p>

                <div className="mt-auto flex items-center justify-between pt-5">
                  <p className="text-lg font-bold text-white">{product.price}</p>
                  <button
                    type="button"
                    className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
                  >
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
