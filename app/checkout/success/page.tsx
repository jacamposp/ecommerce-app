'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/stores/cart-store'

export default function CheckoutSuccessPage() {
  const clearCart = () => useCartStore.setState({ items: [] })

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-white">
      <h1 className="text-4xl uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
        Order confirmed
      </h1>
      <p className="mt-3 text-white/50">Thanks for your purchase.</p>
      <Link
        href="/products"
        className="mt-8 rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase"
      >
        Continue shopping
      </Link>
    </main>
  )
}
