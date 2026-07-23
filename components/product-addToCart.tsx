'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCartStore, type CartState } from '@/lib/stores/cart-store'
import { SIZES, type Size, type StockBySize } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  productId: string
  price: number
  stock: StockBySize
  productName: string
  image: string | null
}

export default function ProductAddToCart({ productId, price, stock, image, productName }: Props) {
  const addItem = useCartStore((state: CartState) => state.addItem)
  const [open, setOpen] = useState(false)

  const allSoldOut = SIZES.every((s) => stock[s] <= 0)

  const handlePick = (size: Size) => {
    addItem({ productId, productName, size, quantity: 1, price, image })
    setOpen(false)
  }

  if (allSoldOut) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled
        className="rounded-full border-white/10 bg-transparent px-4 text-xs font-semibold uppercase tracking-wider text-white/30"
      >
        Sold out
      </Button>
    )
  }

  return (
    <div className="relative">
      {open && (
        <>
          {/* click-away layer */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 bottom-full z-50 mb-2 flex gap-1.5 rounded-full border border-white/15 bg-[#0a0a0a] p-1.5 shadow-xl"
          >
            {SIZES.map((s) => {
              const soldOut = stock[s] <= 0
              return (
                <button
                  key={s}
                  type="button"
                  role="menuitem"
                  onClick={() => handlePick(s)}
                  disabled={soldOut}
                  aria-label={soldOut ? `${s} sold out` : `Add size ${s}`}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full text-xs font-semibold uppercase transition-all',
                    soldOut
                      ? 'cursor-not-allowed text-white/20 line-through'
                      : 'text-white/70 hover:bg-white/15 hover:text-white',
                  )}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-full border-white/20 bg-transparent px-4 text-xs font-semibold uppercase tracking-wider text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
        onClick={() => setOpen((v) => !v)}
      >
        Add
      </Button>
    </div>
  )
}
