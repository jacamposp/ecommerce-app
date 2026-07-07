import HeroCarousel from '@/components/hero-carousel'
import ProductsSection from '@/components/products-section'
import { toHeroSlide } from '@/lib/hero-slide'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
  })

  return (
    <main>
      <HeroCarousel slides={products.map(toHeroSlide)} />
      <ProductsSection />
    </main>
  )
}
