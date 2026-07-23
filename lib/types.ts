/**
 * Store types
 *
 *
 */
export const SIZES = ['S', 'M', 'L', 'XL'] as const
export type Size = (typeof SIZES)[number]

/**
 * Maps a size to its `Product` stock column. Used to build Prisma
 * `where`/`data` clauses for per-size stock reservation and restock.
 */
export const STOCK_FIELD = {
  S: 'stockS',
  M: 'stockM',
  L: 'stockL',
  XL: 'stockXL',
} as const satisfies Record<Size, string>

/** Product-like shape carrying the four per-size stock columns. */
export type StockBySize = Record<Size, number>

type ProductStockColumns = {
  stockS: number
  stockM: number
  stockL: number
  stockXL: number
}

/** Projects a product's four stock columns into a `{ S, M, L, XL }` map. */
export function stockBySize(p: ProductStockColumns): StockBySize {
  return { S: p.stockS, M: p.stockM, L: p.stockL, XL: p.stockXL }
}

/** Total units across every size. */
export function totalStock(stock: ProductStockColumns): number {
  return stock.stockS + stock.stockM + stock.stockL + stock.stockXL
}

export type CartItem = {
  productId: string
  size: Size
  quantity: number
  price: number
  //Just display
  image: string | null
  productName: string
}
