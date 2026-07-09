'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { SideCart, type SideCartItem } from '@/components/side-cart'
import { useCartStore, type CartState } from '@/lib/stores/cart-store'
import { cn } from '@/lib/utils'

function mapCartItems(items: CartState['items']): SideCartItem[] {
  return items.map((item) => ({
    productId: item.productId,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    productName: item.productName,
  }))
}

export function CartDrawer() {
  const [open, setOpen] = useState(false)
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'fixed top-6 right-6 z-50 flex size-12 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-all duration-200',
          'hover:border-white/30 hover:bg-black/60',
        )}
        aria-label={itemCount > 0 ? `Open bag, ${itemCount} items` : 'Open bag'}
      >
        <ShoppingBag className="size-5" strokeWidth={1.75} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-white text-[10px] font-bold tabular-nums text-black">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>

      <SideCart
        open={open}
        onClose={() => setOpen(false)}
        items={mapCartItems(items)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={(productId) => updateQuantity(productId, 0)}
      />
    </>
  )
}
