import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { updateProduct } from '@/app/actions/admin-products'
import { ProductForm } from '@/components/admin/product-form'

type Props = { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) notFound()

  const updateProductWithId = updateProduct.bind(null, product.id)

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-muted-foreground hover:underline">
          ← Products
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{product.name}</h1>
      </div>

      <ProductForm
        action={updateProductWithId}
        submitLabel="Save changes"
        defaultValues={{
          name: product.name,
          slug: product.slug,
          description: product.description ?? '',
          price: product.price.toString(),
          stock: product.stock.toString(),
          image: product.image ?? '',
          category: product.category ?? '',
        }}
      />
    </div>
  )
}
