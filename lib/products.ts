export const PRODUCTS = [
  {
    name: 'HOME KIT MANCHESTER CITY',
    club: 'MAN. CITY',
    season: '2026',
    number: '10',
    price: '$89.99',
    src: '/man-city.png',
    bg: '#1A5276',
    accent: '#B0E2FA',
  },
  {
    name: 'AWAY KIT REAL MADRID',
    club: 'MADRID',
    season: '2026',
    number: '09',
    price: '$89.99',
    src: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=85&auto=format&fit=crop',
    bg: '#111827',
    accent: '#E63946',
  },
  {
    name: 'THIRD KIT MILAN',
    club: 'MILAN',
    season: '2026',
    number: '07',
    price: '$94.99',
    src: '/milan.png',
    bg: '#1F1A0C',
    accent: '#C9A227',
  },
  {
    name: 'HOME KIT CHELSEA',
    club: 'CHELSEA',
    season: '2026',
    number: '11',
    price: '$119.99',
    src: '/chelsea.png',
    bg: '#001E50',
    accent: '#034694',
  },
] as const

export type Product = (typeof PRODUCTS)[number]
