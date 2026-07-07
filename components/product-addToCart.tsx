'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore, type CartState } from '@/lib/stores/cart-store'
import { cn } from '@/lib/utils'

type Props = {
  productId: string
  price: number
  stock: number
}

const stepperButtonClass =
  'flex size-7 shrink-0 items-center justify-center text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-30'

export default function ProductAddToCart({ productId, price, stock }: Props) {
  const items = useCartStore((state: CartState) => state.items)
  const addItem = useCartStore((state: CartState) => state.addItem)
  const updateQuantity = useCartStore((state: CartState) => state.updateQuantity)

  const cartItem = items.find((i) => i.productId === productId)

  const handleAddToCart = () => {
    addItem({
      productId,
      quantity: 1,
      price,
    })
  }

  if (cartItem) {
    const qty = cartItem.quantity

    return (
      <div className="inline-flex h-7 items-center rounded-full border border-white/20 bg-transparent transition-all duration-200 hover:border-white/40 hover:bg-white/10">
        <button
          type="button"
          onClick={() => updateQuantity(productId, qty - 1)}
          className={cn(stepperButtonClass, 'rounded-l-full pl-0.5')}
          aria-label="Decrease quantity"
        >
          <Minus className="size-3" strokeWidth={2.5} />
        </button>
        <span className="min-w-7 border-x border-white/10 px-1 text-center text-xs font-semibold tabular-nums text-white">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => updateQuantity(productId, Math.min(stock, qty + 1))}
          disabled={qty >= stock}
          className={cn(stepperButtonClass, 'rounded-r-full pr-0.5')}
          aria-label="Increase quantity"
        >
          <Plus className="size-3" strokeWidth={2.5} />
        </button>
      </div>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="rounded-full border-white/20 bg-transparent px-4 text-xs font-semibold uppercase tracking-wider text-white hover:border-white/40 hover:bg-white/10 hover:text-white"
      onClick={handleAddToCart}
    >
      Add
    </Button>
  )
}
