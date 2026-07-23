'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem, SIZES, type Size } from '../types'

export interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (productId: string, size: Size, quantity: number) => void
  cleanCart: () => void
}

const isValidSize = (value: unknown): value is Size =>
  typeof value === 'string' && (SIZES as readonly string[]).includes(value)

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId && i.size === item.size,
          )
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      updateQuantity: (productId, size, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => !(i.productId === productId && i.size === size))
              : state.items.map((i) =>
                  i.productId === productId && i.size === size ? { ...i, quantity } : i,
                ),
        })),
      cleanCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      // v2: cart items are now keyed by (productId, size). Older persisted
      // items had no size — drop them rather than guess.
      version: 2,
      migrate: (persisted) => {
        const items = Array.isArray((persisted as { items?: unknown })?.items)
          ? ((persisted as { items: unknown[] }).items.filter(
              (i) => isValidSize((i as CartItem)?.size),
            ) as CartItem[])
          : []
        return { items }
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
