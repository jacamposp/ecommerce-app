/**
 * Store types
 *
 *
 */
export type Size = 'S' | 'M' | 'L' | 'XL'

export type CartItem = {
  productId: string
  quantity: number
  price: number
  //Just display 
  image: string | null
  productName: string
}
