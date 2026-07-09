'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type SideCartItem = {
  productId: string
  productName: string
  image?: string | null
  price: number
  quantity: number
  size?: string
}

type SideCartProps = {
  open: boolean
  onClose: () => void
  items?: SideCartItem[]
  onUpdateQuantity?: (productId: string, quantity: number) => void
  onRemoveItem?: (productId: string) => void
}

const stepperButtonClass =
  'flex size-7 shrink-0 items-center justify-center text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-30'

function CartLineItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: {
  item: SideCartItem
  onUpdateQuantity?: (productId: string, quantity: number) => void
  onRemoveItem?: (productId: string) => void
}) {
  const lineTotal = item.price * item.quantity
  console.log(item)
  return (
    <li className="flex gap-4 border-b border-white/8 py-5">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-white/3">
        {item.image ? (
          <Image src={item.image} alt={item.productName} fill sizes="80px" className="object-cover object-top" />
        ) : (
          <div className="flex h-full items-center justify-center text-white/20">
            <ShoppingBag className="size-6" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold uppercase tracking-wide text-white">{item.productName}</p>
            {item.size && (
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">Size {item.size}</p>
            )}
          </div>
          <p className="shrink-0 text-sm font-bold tabular-nums text-white">$ {lineTotal.toFixed(2)}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex h-7 items-center rounded-full border border-white/15 bg-white/3">
            <button
              type="button"
              onClick={() => onUpdateQuantity?.(item.productId, item.quantity - 1)}
              className={cn(stepperButtonClass, 'rounded-l-full pl-0.5')}
              aria-label={`Decrease quantity of ${item.productName}`}
            >
              <Minus className="size-3" strokeWidth={2.5} />
            </button>
            <span className="min-w-7 border-x border-white/10 px-1 text-center text-xs font-semibold tabular-nums text-white">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity?.(item.productId, item.quantity + 1)}
              className={cn(stepperButtonClass, 'rounded-r-full pr-0.5')}
              aria-label={`Increase quantity of ${item.productName}`}
            >
              <Plus className="size-3" strokeWidth={2.5} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemoveItem?.(item.productId)}
            className="text-xs font-semibold uppercase tracking-wider text-white/35 transition-colors hover:text-white/70"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}

function EmptyCart() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/3">
        <ShoppingBag className="size-7 text-white/30" strokeWidth={1.5} />
      </div>
      <p
        className="mt-6 text-xl uppercase text-white"
        style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
      >
        Your bag is empty
      </p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/40">
        Add a jersey to your bag and it will show up here, ready for checkout.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-flex h-11 items-center rounded-full border border-white/20 px-6 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:border-white/40 hover:bg-white/10"
      >
        Shop all kits
      </Link>
    </div>
  )
}

export function SideCart({ open, onClose, items = [], onUpdateQuantity, onRemoveItem }: SideCartProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const hasItems = items.length > 0

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="side-cart-title"
        aria-hidden={!open}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/8 bg-[#0a0a0a] text-white shadow-2xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div className="flex items-center gap-3">
            <h2
              id="side-cart-title"
              className="text-xl uppercase"
              style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
            >
              Your Bag
            </h2>
            {hasItems && (
              <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-white/25 hover:bg-white/5 hover:text-white"
            aria-label="Close cart"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </header>

        {hasItems ? (
          <>
            <ul className="flex-1 overflow-y-auto px-6">
              {items.map((item) => (
                <CartLineItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </ul>

            <footer className="border-t border-white/8 px-6 py-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Subtotal</span>
                  <span className="text-lg font-bold tabular-nums">$ {subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-white/35">Shipping and taxes calculated at checkout.</p>
                {subtotal < 100 && (
                  <p className="text-xs text-white/45">
                    Add <span className="font-semibold text-white/70">$ {(100 - subtotal).toFixed(2)}</span> more for
                    free shipping.
                  </p>
                )}
              </div>

              <Button
                type="button"
                className="mt-6 h-12 w-full rounded-full bg-white text-sm font-semibold uppercase tracking-wider text-black hover:bg-white/90"
              >
                Checkout
              </Button>

              <button
                type="button"
                onClick={onClose}
                className="mt-4 w-full text-center text-xs font-semibold uppercase tracking-wider text-white/40 transition-colors hover:text-white/70"
              >
                Continue shopping
              </button>
            </footer>
          </>
        ) : (
          <EmptyCart />
        )}
      </aside>
    </>
  )
}
