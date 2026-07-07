import type { Product } from '@/generated/prisma/client'
import { getHeroTheme } from '@/lib/hero-themes'

export type HeroSlide = {
  id: string
  slug: string
  name: string
  club: string
  season: string
  price: string
  image: string
  bg: string
  accent: string
}

export function toHeroSlide(product: Product): HeroSlide {
  const theme = getHeroTheme(product.slug)

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    club: theme.club,
    season: theme.season,
    price: `$${Number(product.price).toFixed(2)}`,
    image: product.image ?? '/placeholder.png',
    bg: theme.bg,
    accent: theme.accent,
  }
}
