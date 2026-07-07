'use client'

import { create } from 'zustand'
import { CartItem } from '../types'

export interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  //   removeItem: (id: string) => void
  //   clearCart: () => void
  updateQuantity: (productId: string, quantity: number) => void
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  addItem: (item: CartItem) =>
    set((state: CartState) => {
      const existingItem = state.items.find((i) => i.productId === item.productId)
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i,
          ),
        }
      }

      return { items: [...state.items, item] }
    }),
  updateQuantity: (productId: string, quantity: number) =>
    set((state: CartState) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.productId !== productId)
          : state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    })),
}))
