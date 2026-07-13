import type { Metadata } from 'next'
import { Anton, Inter, Geist } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { CartDrawer } from '@/components/cart-drawer'
import { AccountButton } from '@/components/auth/account-button'
import { StorefrontChrome } from '@/components/storefront-chrome'

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
})

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
})

export const metadata: Metadata = {
  title: 'Elite Soccer — Authentic Matchday Jerseys',
  description:
    "Premium soccer kits inspired by the world's biggest clubs. Home, away, and special edition jerseys for the 2026 season.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("min-h-full", inter.variable, anton.variable, "font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full overflow-x-hidden antialiased">
        {children}
        <StorefrontChrome>
          <AccountButton />
          <CartDrawer />
        </StorefrontChrome>
      </body>
    </html>
  )
}
