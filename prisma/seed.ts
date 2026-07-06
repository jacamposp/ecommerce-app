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
    stock: 48,
    category: 'Home',
  },
  {
    slug: 'away-kit-real-madrid-2026',
    name: 'AWAY KIT REAL MADRID',
    description:
      'Real Madrid away kit with tonal stripes and gold accents. Built for supporters who want a clean matchday look.',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=85&auto=format&fit=crop',
    stock: 36,
    category: 'Away',
  },
  {
    slug: 'third-kit-milan-2026',
    name: 'THIRD KIT MILAN',
    description:
      'AC Milan third shirt in deep charcoal with gold trim. Limited-run colorway for the 2026 season.',
    price: 94.99,
    image: '/milan.png',
    stock: 22,
    category: 'Third',
  },
  {
    slug: 'home-kit-chelsea-2026',
    name: 'HOME KIT CHELSEA',
    description:
      'Classic Chelsea blue with modern raglan sleeves and embossed club badge. Premium supporter fit.',
    price: 119.99,
    image: '/chelsea.png',
    stock: 15,
    category: 'Home',
  },
  {
    slug: 'home-kit-barcelona-2026',
    name: 'HOME KIT BARCELONA',
    description:
      'Blaugrana stripes with recycled performance fabric and breathable side mesh.',
    price: 99.99,
    image:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=85&auto=format&fit=crop',
    stock: 40,
    category: 'Home',
  },
  {
    slug: 'away-kit-liverpool-2026',
    name: 'AWAY KIT LIVERPOOL',
    description:
      'Liverpool away jersey in deep green with volt accents. Moisture-wicking finish for all-day wear.',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=85&auto=format&fit=crop',
    stock: 31,
    category: 'Away',
  },
  {
    slug: 'third-kit-psg-2026',
    name: 'THIRD KIT PSG',
    description:
      'Paris Saint-Germain third kit in midnight navy with iridescent crest detailing.',
    price: 104.99,
    image:
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=85&auto=format&fit=crop',
    stock: 27,
    category: 'Third',
  },
  {
    slug: 'away-kit-bayern-munich-2026',
    name: 'AWAY KIT BAYERN MUNICH',
    description:
      'Bayern Munich away shirt in crisp white with red piping and tonal club crest.',
    price: 94.99,
    image:
      'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=85&auto=format&fit=crop',
    stock: 33,
    category: 'Away',
  },
  {
    slug: 'training-top-inter-2026',
    name: 'TRAINING TOP INTER MILAN',
    description:
      'Inter Milan training top with quarter-zip collar and lightweight stretch fabric.',
    price: 64.99,
    image:
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=85&auto=format&fit=crop',
    stock: 55,
    category: 'Training',
  },
  {
    slug: 'retro-kit-arsenal-2004',
    name: 'RETRO KIT ARSENAL 2004',
    description:
      'Throwback Arsenal invincibles-era jersey with classic collar and embroidered badge.',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=85&auto=format&fit=crop',
    stock: 18,
    category: 'Retro',
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
            quantity: 1,
            price: 89.99,
          },
          {
            productId: bySlug['away-kit-real-madrid-2026'].id,
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
            quantity: 1,
            price: 64.99,
          },
          {
            productId: bySlug['retro-kit-arsenal-2004'].id,
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
