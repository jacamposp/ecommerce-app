export const FREE_SHIPPING_THRESHOLD = 100
export const SHIPPING_COST = 12

export function calculateShipping(subtotal: number) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
}
