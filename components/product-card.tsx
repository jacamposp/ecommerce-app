import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'
import { Product } from '@/generated/prisma/client'
import ProductAddToCart from '@/components/product-addToCart'

export default function ProductCard({ product }: { product: Product }) {
  const productId = product.id
  const price = Number(product.price)
  return (
    <Card className="group relative gap-0 overflow-hidden rounded-2xl border-white/8 bg-white/3 py-0 text-white ring-0 transition-all duration-300 hover:border-white/15 hover:bg-white/6">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-3/4 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 50% 20%, #1A527644 0%, transparent 60%)`,
            }}
          />
          <Image
            src={product.image ?? ''}
            fill
            alt={product.name}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="relative z-10 h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>

        <CardContent className="flex flex-1 flex-col px-5 pt-5 pb-0">
          {/* <p className="text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: product.accent }}>
            {product.club}
          </p> */}
          <CardTitle className="mt-1 text-sm font-semibold uppercase tracking-wide text-white">
            {product.name}
          </CardTitle>
          {/* <CardDescription className="mt-1 text-xs text-white/40">{product.season} Season</CardDescription> */}
        </CardContent>
      </Link>
      <CardFooter className="mt-auto flex items-center justify-between border-0 bg-transparent px-5 pt-5 pb-5">
        <p className="text-lg font-bold text-white">$ {product.price.toFixed(2)}</p>
        <ProductAddToCart
          productId={productId}
          price={price}
          stock={product.stock}
          image={product.image}
          productName={product.name}
        />
      </CardFooter>
    </Card>
  )
}
