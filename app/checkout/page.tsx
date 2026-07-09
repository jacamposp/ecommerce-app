'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/stores/cart-store'
import { Button } from '@/components/ui/button'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  async function handleCheckout() {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Checkout failed')
      return
    }

    window.location.href = data.url // redirect to Stripe
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] px-6 py-20 text-white">
        <p>Your bag is empty.</p>
        <Button onClick={() => router.push('/products')}>Shop kits</Button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-20 text-white">
      <h1 className="text-3xl uppercase" style={{ fontFamily: "'Anton', sans-serif" }}>
        Checkout
      </h1>

      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li key={item.productId} className="flex justify-between border-b border-white/10 py-3">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>$ {(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-lg font-bold">Total: $ {subtotal.toFixed(2)}</p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <Button
        className="mt-8 h-12 rounded-full bg-white text-black hover:bg-white/90"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Redirecting…' : 'Pay with Stripe'}
      </Button>
    </main>
  )
}
