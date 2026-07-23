import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Role } from '../generated/prisma/client'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const products = [
  {
    slug: 'home-kit-manchester-city-2026',
    name: 'HOME KIT MANCHESTER CITY',
    description:
      'Sky blue home jersey inspired by Manchester City’s 2026 campaign. Lightweight mesh panels, club crest, and sponsor print.',
    price: 89.99,
    image: '/man-city.png',
    stockS: 12,
    stockM: 16,
    stockL: 14,
    stockXL: 6,
    category: 'Home',
    club: 'MAN. CITY',
    season: '2026',
    heroBg: '#1A5276',
    heroAccent: '#B0E2FA',
  },
  {
    slug: 'away-kit-real-madrid-2026',
    name: 'AWAY KIT REAL MADRID',
    description:
      'Real Madrid away kit with tonal stripes and gold accents. Built for supporters who want a clean matchday look.',
    price: 89.99,
    image:
      'https://a6k0piuuwtllmxip.public.blob.vercel-storage.com/products/c91ad28e-2b19-4c44-8369-8be3ab877c2b-rm-tshirt.png',
    stockS: 8,
    stockM: 12,
    stockL: 10,
    stockXL: 6,
    category: 'Away',
    club: 'MADRID',
    season: '2026',
    heroBg: '#111827',
    heroAccent: '#E63946',
  },
  {
    slug: 'third-kit-milan-2026',
    name: 'THIRD KIT MILAN',
    description:
      'AC Milan third shirt in deep charcoal with gold trim. Limited-run colorway for the 2026 season.',
    price: 94.99,
    image: '/milan.png',
    stockS: 5,
    stockM: 8,
    stockL: 6,
    stockXL: 3,
    category: 'Third',
    club: 'MILAN',
    season: '2026',
    heroBg: '#1F1A0C',
    heroAccent: '#C9A227',
  },
  {
    slug: 'home-kit-chelsea-2026',
    name: 'HOME KIT CHELSEA',
    description:
      'Classic Chelsea blue with modern raglan sleeves and embossed club badge. Premium supporter fit.',
    price: 119.99,
    image: '/chelsea.png',
    stockS: 0,
    stockM: 3,
    stockL: 2,
    stockXL: 0,
    category: 'Home',
    club: 'CHELSEA',
    season: '2026',
    heroBg: '#001E50',
    heroAccent: '#034694',
  },
  {
    slug: 'home-kit-barcelona-2026',
    name: 'HOME KIT BARCELONA',
    description:
      'Blaugrana stripes with recycled performance fabric and breathable side mesh.',
    price: 99.99,
    image:
      'https://a6k0piuuwtllmxip.public.blob.vercel-storage.com/products/6894feac-111c-410f-b528-617c061e0751-fcb-kit.png',
    stockS: 10,
    stockM: 14,
    stockL: 12,
    stockXL: 4,
    category: 'Home',
    club: 'BARÇA',
    season: '2026',
    heroBg: '#0A1E5C',
    heroAccent: '#A50044',
  },
  {
    slug: 'away-kit-liverpool-2026',
    name: 'AWAY KIT LIVERPOOL',
    description:
      'Liverpool away jersey in deep green with volt accents. Moisture-wicking finish for all-day wear.',
    price: 89.99,
    image:
      'https://a6k0piuuwtllmxip.public.blob.vercel-storage.com/products/6c2c3ec2-4225-473b-b6aa-e3d4c65c20b6-liver.png',
    stockS: 7,
    stockM: 10,
    stockL: 9,
    stockXL: 5,
    category: 'Away',
    club: 'LIVERPOOL',
    season: '2026',
    heroBg: '#111827',
    heroAccent: '#C8102E',
  },
  {
    slug: 'third-kit-psg-2026',
    name: 'THIRD KIT PSG',
    description:
      'Paris Saint-Germain third kit in midnight navy with iridescent crest detailing.',
    price: 104.99,
    image:
      'https://a6k0piuuwtllmxip.public.blob.vercel-storage.com/products/87d4fe18-060a-4502-92e6-efb4fc035fbb-psg.png',
    stockS: 6,
    stockM: 9,
    stockL: 8,
    stockXL: 4,
    category: 'Third',
    club: 'PSG',
    season: '2026',
    heroBg: '#0B1B3A',
    heroAccent: '#004170',
  },
  {
    slug: 'away-kit-bayern-munich-2026',
    name: 'AWAY KIT BAYERN MUNICH',
    description:
      'Bayern Munich away shirt in crisp white with red piping and tonal club crest.',
    price: 94.99,
    image:
      'https://a6k0piuuwtllmxip.public.blob.vercel-storage.com/products/c61f3851-5960-448e-b6d6-4fc64ad237e0-bayern.png',
    stockS: 8,
    stockM: 11,
    stockL: 9,
    stockXL: 5,
    category: 'Away',
    club: 'BAYERN',
    season: '2026',
    heroBg: '#111827',
    heroAccent: '#DC052D',
  },
  {
    slug: 'training-top-inter-2026',
    name: 'TRAINING TOP INTER MILAN',
    description:
      'Inter Milan training top with quarter-zip collar and lightweight stretch fabric.',
    price: 64.99,
    image:
      'https://a6k0piuuwtllmxip.public.blob.vercel-storage.com/products/f17cfc9d-bb1c-418f-909f-4f3ef48c3488-inter.png',
    stockS: 14,
    stockM: 18,
    stockL: 15,
    stockXL: 8,
    category: 'Training',
    club: 'INTER',
    season: '2026',
    heroBg: '#111827',
    heroAccent: '#0068A8',
  },
  {
    slug: 'retro-kit-arsenal-2004',
    name: 'RETRO KIT ARSENAL 2004',
    description:
      'Throwback Arsenal invincibles-era jersey with classic collar and embroidered badge.',
    price: 79.99,
    image:
      'https://a6k0piuuwtllmxip.public.blob.vercel-storage.com/products/0e005e13-262e-4690-81e5-12f3ae97c4f4-arsenal-kit.png',
    stockS: 4,
    stockM: 6,
    stockL: 5,
    stockXL: 3,
    category: 'Retro',
    club: 'ARSENAL',
    season: '2004',
    heroBg: '#9C824A',
    heroAccent: '#EF0107',
  },
] as const

async function main() {
  console.log('Clearing existing data...')

  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding users...')

  const admin = await prisma.user.create({
    data: {
      id: 'seed-user-admin',
      name: 'Store Admin',
      email: 'admin@kitstore.com',
      role: Role.ADMIN,
      emailVerified: new Date('2026-01-15T10:00:00.000Z'),
      image: 'https://api.dicebear.com/9.x/shapes/svg?seed=admin',
    },
  })

  const john = await prisma.user.create({
    data: {
      id: 'seed-user-john',
      name: 'John Rivera',
      email: 'john@example.com',
      role: Role.USER,
      emailVerified: new Date('2026-02-01T14:30:00.000Z'),
      image: 'https://api.dicebear.com/9.x/shapes/svg?seed=john',
    },
  })

  const jane = await prisma.user.create({
    data: {
      id: 'seed-user-jane',
      name: 'Jane Okonkwo',
      email: 'jane@example.com',
      role: Role.USER,
      emailVerified: new Date('2026-02-10T09:15:00.000Z'),
      image: 'https://api.dicebear.com/9.x/shapes/svg?seed=jane',
    },
  })

  console.log('Seeding products...')

  const createdProducts = await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: product,
      }),
    ),
  )

  const bySlug = Object.fromEntries(createdProducts.map((product) => [product.slug, product]))

  console.log('Seeding orders...')

  await prisma.order.create({
    data: {
      id: 'seed-order-paid',
      userId: john.id,
      status: 'paid',
      total: 179.98,
      stripePaymentId: 'pi_seed_paid_001',
      createdAt: new Date('2026-03-02T16:20:00.000Z'),
      items: {
        create: [
          {
            productId: bySlug['home-kit-manchester-city-2026'].id,
            size: 'M',
            quantity: 1,
            price: 89.99,
          },
          {
            productId: bySlug['away-kit-real-madrid-2026'].id,
            size: 'L',
            quantity: 1,
            price: 89.99,
          },
        ],
      },
    },
  })

  await prisma.order.create({
    data: {
      id: 'seed-order-shipped',
      userId: jane.id,
      status: 'shipped',
      total: 94.99,
      stripePaymentId: 'pi_seed_shipped_001',
      createdAt: new Date('2026-03-08T11:45:00.000Z'),
      items: {
        create: [
          {
            productId: bySlug['third-kit-milan-2026'].id,
            size: 'M',
            quantity: 1,
            price: 94.99,
          },
        ],
      },
    },
  })

  await prisma.order.create({
    data: {
      id: 'seed-order-pending',
      userId: john.id,
      status: 'pending',
      total: 119.99,
      createdAt: new Date('2026-06-20T18:05:00.000Z'),
      items: {
        create: [
          {
            productId: bySlug['home-kit-chelsea-2026'].id,
            size: 'M',
            quantity: 1,
            price: 119.99,
          },
        ],
      },
    },
  })

  await prisma.order.create({
    data: {
      id: 'seed-order-guest',
      status: 'paid',
      total: 164.98,
      stripePaymentId: 'pi_seed_guest_001',
      createdAt: new Date('2026-05-14T08:30:00.000Z'),
      items: {
        create: [
          {
            productId: bySlug['training-top-inter-2026'].id,
            size: 'L',
            quantity: 1,
            price: 64.99,
          },
          {
            productId: bySlug['retro-kit-arsenal-2004'].id,
            size: 'M',
            quantity: 1,
            price: 79.99,
          },
        ],
      },
    },
  })

  await prisma.order.create({
    data: {
      id: 'seed-order-cancelled',
      userId: jane.id,
      status: 'cancelled',
      total: 99.99,
      createdAt: new Date('2026-04-22T20:10:00.000Z'),
      items: {
        create: [
          {
            productId: bySlug['home-kit-barcelona-2026'].id,
            size: 'M',
            quantity: 1,
            price: 99.99,
          },
        ],
      },
    },
  })

  console.log('Seed complete:')
  console.log(`  Users:    ${await prisma.user.count()}`)
  console.log(`  Products: ${await prisma.product.count()}`)
  console.log(`  Orders:   ${await prisma.order.count()}`)
  console.log(`  Items:    ${await prisma.orderItem.count()}`)
  console.log(`  Admin:    ${admin.email}`)
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
