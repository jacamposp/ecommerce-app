import Link from 'next/link'
import { createProduct } from '@/app/actions/admin-products'
import { ProductForm } from '@/components/admin/product-form'

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-muted-foreground hover:underline">
          ← Products
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">New product</h1>
      </div>

      <ProductForm action={createProduct} submitLabel="Create product" />
    </div>
  )
}
