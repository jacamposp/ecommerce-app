'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/stores/cart-store'
import { CartState } from '@/lib/stores/cart-store'
import { SIZES, type Size, type StockBySize } from '@/lib/types'

type Props = {
  productId: string
  productName: string
  price: number
  stock: StockBySize
  image: string | null
}

export function ProductPurchasePanel({ productId, price, stock, productName, image }: Props) {
  const items = useCartStore((state: CartState) => state.items)
  const addItemToCart = useCartStore((state: CartState) => state.addItem)
  const updateQuantity = useCartStore((state: CartState) => state.updateQuantity)

  const allSoldOut = SIZES.every((s) => stock[s] <= 0)
  const [size, setSize] = useState<Size>(() => SIZES.find((s) => stock[s] > 0) ?? 'M')
  const [pendingQty, setPendingQty] = useState(1)

  const selectedStock = stock[size]
  const outOfStock = selectedStock <= 0
  const lowStock = selectedStock > 0 && selectedStock <= 10

  const cartItem = items.find((i) => i.productId === productId && i.size === size)
  const qty = cartItem ? cartItem.quantity : pendingQty

  const handleSelectSize = (next: Size) => {
    setSize(next)
    setPendingQty(1)
  }

  const handleUpdateQuantity = (nextQty: number) => {
    if (cartItem) {
      updateQuantity(productId, size, nextQty)
    } else {
      setPendingQty(nextQty)
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const soldOut = stock[s] <= 0
            return (
              <button
                key={s}
                type="button"
                onClick={() => handleSelectSize(s)}
                disabled={soldOut}
                aria-label={soldOut ? `${s} — sold out` : `Size ${s}`}
                className={cn(
                  'min-w-12 rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200',
                  soldOut
                    ? 'cursor-not-allowed border-white/5 text-white/20 line-through'
                    : size === s
                      ? 'border-white/40 bg-white/15 text-white'
                      : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/80',
                )}
              >
                {s}
              </button>
            )
          })}
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
            disabled={outOfStock}
            className="px-4 py-2 text-white/60 transition-colors hover:text-white disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-10 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => {
              handleUpdateQuantity(Math.min(selectedStock, qty + 1))
            }}
            disabled={qty >= selectedStock || outOfStock}
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
          addItemToCart({ productId, size, quantity: qty, price, image, productName })
        }}
      >
        {allSoldOut ? 'Sold out' : outOfStock ? `Size ${size} sold out` : 'Add to bag'}
      </Button>

      <p className={cn('text-xs', lowStock ? 'text-amber-400/80' : 'text-white/40')}>
        {allSoldOut
          ? 'Currently unavailable'
          : outOfStock
            ? `Size ${size} is sold out — try another size`
            : lowStock
              ? `Only ${selectedStock} left in ${size} — order soon`
              : `${selectedStock} in stock · size ${size}`}
      </p>
    </div>
  )
}
