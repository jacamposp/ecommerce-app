'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/stores/cart-store'
import { CartState } from '@/lib/stores/cart-store'

const SIZES = ['S', 'M', 'L', 'XL'] as const

type Props = {
  productId: string
  price: number
  stock: number
}

export function ProductPurchasePanel({ productId, price, stock }: Props) {
  const items = useCartStore((state: CartState) => state.items)
  const addItemToCart = useCartStore((state: CartState) => state.addItem)
  const updateQuantity = useCartStore((state: CartState) => state.updateQuantity)
  const [size, setSize] = useState<(typeof SIZES)[number]>('M')

  const cartItem = items.find((i) => i.productId === productId)
  const [pendingQty, setPendingQty] = useState(1)
  const qty = cartItem ? cartItem.quantity : pendingQty

  const outOfStock = stock <= 0
  const lowStock = stock > 0 && stock <= 10

  console.log('Items:', items)

  const handleUpdateQuantity = (nextQty: number) => {
    if (cartItem) {
      updateQuantity(productId, nextQty)
    } else {
      setPendingQty(nextQty)
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={cn(
                'min-w-12 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200',
                size === s
                  ? 'border-white/40 bg-white/15 text-white'
                  : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/80',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Quantity</p>
        <div className="inline-flex items-center rounded-full border border-white/15">
          <button
            type="button"
            onClick={() => {
              handleUpdateQuantity(Math.max(1, qty - 1))
            }}
            className="px-4 py-2 text-white/60 transition-colors hover:text-white"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-10 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => {
              handleUpdateQuantity(Math.min(stock, qty + 1))
            }}
            disabled={qty >= stock || outOfStock}
            className="px-4 py-2 text-white/60 transition-colors hover:text-white disabled:opacity-30"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <Button
        type="button"
        disabled={outOfStock}
        className="h-12 w-full rounded-full bg-white text-sm font-semibold uppercase tracking-wider text-black hover:bg-white/90 disabled:opacity-40"
        onClick={() => {
          addItemToCart({ productId, quantity: qty, price: price })
        }}
      >
        {outOfStock ? 'Sold out' : 'Add to bag'}
      </Button>

      <p className={cn('text-xs', lowStock ? 'text-amber-400/80' : 'text-white/40')}>
        {outOfStock ? 'Currently unavailable' : lowStock ? `Only ${stock} left — order soon` : `${stock} in stock`}
      </p>
    </div>
  )
}
