'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import type { ProductFormState } from '@/app/actions/admin-products'

type ProductFormValues = {
  name: string
  slug: string
  description: string
  price: string
  stock: string
  image: string
  category: string
}

export function ProductForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>
  defaultValues?: Partial<ProductFormValues>
  submitLabel: string
}) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, undefined)

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="slug" className="text-sm font-medium">
          Slug <span className="font-normal text-muted-foreground">(optional — derived from name if blank)</span>
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={defaultValues?.slug}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="price" className="text-sm font-medium">
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={defaultValues?.price}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="stock" className="text-sm font-medium">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            step="1"
            min="0"
            required
            defaultValue={defaultValues?.stock}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <input
          id="category"
          name="category"
          defaultValue={defaultValues?.category}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="image" className="text-sm font-medium">
          Image URL
        </label>
        <input
          id="image"
          name="image"
          defaultValue={defaultValues?.image}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
