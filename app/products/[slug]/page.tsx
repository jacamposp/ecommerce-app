import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/product-card'
import { ProductPurchasePanel } from '@/components/product-purchase-panel'
import { stockBySize } from '@/lib/types'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) return { title: 'Product not found' }

  return {
    title: `${product.name} — Elite Soccer`,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) notFound()

  const related = await prisma.product.findMany({
    where: { category: product.category, slug: { not: slug } },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  const price = Number(product.price)

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-black/70 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <Link
          href="/products"
          className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/40 transition-colors hover:text-white/70"
        >
          ← All Kits
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <div className="relative aspect-3/4 overflow-hidden rounded-3xl border border-white/8 bg-white/3">
              <div
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                  background: 'radial-gradient(circle at 50% 25%, #1A527666 0%, transparent 65%)',
                }}
              />
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="relative z-10 object-contain p-10"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="hero-content-animate">
              {product.category && (
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                  {product.category} · 2026 Collection
                </p>
              )}
              <h1
                className="mt-3 text-4xl uppercase leading-[0.95] md:text-5xl lg:text-6xl"
                style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
              >
                {product.name}
              </h1>
              <p className="mt-6 text-3xl font-bold tracking-tight">$ {price.toFixed(2)}</p>
            </div>

            <ProductPurchasePanel productId={product.id} price={price} stock={stockBySize(product)} image={product.image} productName={product.name} />

            {product.description && (
              <div className="mt-12 border-t border-white/8 pt-10">
                <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Description</h2>
                <p className="mt-4 max-w-prose text-sm leading-relaxed text-white/60 md:text-base">
                  {product.description}
                </p>
              </div>
            )}

            <ul className="mt-8 flex flex-wrap gap-4 text-xs text-white/40">
              <li>Free shipping over $100</li>
              <li>·</li>
              <li>30-day returns</li>
              <li>·</li>
              <li>Authentic-inspired fit</li>
            </ul>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-white/8 pt-16">
            <h2 className="text-2xl uppercase md:text-3xl" style={{ fontFamily: "'Anton', sans-serif" }}>
              You may also like
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
