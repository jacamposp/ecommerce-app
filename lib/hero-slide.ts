import type { Product } from '@/generated/prisma/client'

export type HeroSlide = {
  id: string
  slug: string
  name: string
  club: string
  season: string
  price: string
  image: string
  /** null = derive from the jersey image on the client */
  bg: string | null
  accent: string | null
}

const KIT_TYPE_TOKENS = new Set([
  'HOME',
  'AWAY',
  'THIRD',
  'RETRO',
  'TRAINING',
  'KIT',
  'TOP',
  'JERSEY',
  'SHIRT',
])

const YEAR_RE = /(19|20)\d{2}/

function deriveClub(name: string): string {
  const club = name
    .toUpperCase()
    .split(/\s+/)
    .filter((token) => !KIT_TYPE_TOKENS.has(token) && !/^(19|20)\d{2}$/.test(token))
    .join(' ')
    .trim()

  return club || 'ELITE'
}

function deriveSeason(name: string, slug: string): string {
  const match = slug.match(YEAR_RE) ?? name.match(YEAR_RE)
  return match ? match[0] : String(new Date().getFullYear())
}

export function toHeroSlide(product: Product): HeroSlide {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    club: product.club ?? deriveClub(product.name),
    season: product.season ?? deriveSeason(product.name, product.slug),
    price: `$${Number(product.price).toFixed(2)}`,
    image: product.image ?? '/placeholder.png',
    bg: product.heroBg,
    accent: product.heroAccent,
  }
}
