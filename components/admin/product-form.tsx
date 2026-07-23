'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import type { ProductFormState } from '@/app/actions/admin-products'
import { SIZES } from '@/lib/types'

type ProductFormValues = {
  name: string
  slug: string
  description: string
  price: string
  stockS: string
  stockM: string
  stockL: string
  stockXL: string
  image: string
  category: string
  club: string
  season: string
  heroBg: string
  heroAccent: string
}

function ColorField({
  name,
  label,
  defaultValue,
}: {
  name: string
  label: string
  defaultValue?: string
}) {
  const [value, setValue] = useState(defaultValue ?? '')

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label} <span className="font-normal text-muted-foreground">(optional)</span>
      </label>
      <div className="flex items-center gap-2">
        <input
          id={name}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Auto from image"
          pattern="#[0-9a-fA-F]{6}"
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <input
          type="color"
          aria-label={`${label} picker`}
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'}
          onChange={(event) => setValue(event.target.value)}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-1"
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue('')}
            className="shrink-0 text-xs text-muted-foreground hover:underline"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
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

      <fieldset className="space-y-3 rounded-md border border-input p-4">
        <legend className="px-1 text-sm font-semibold">Stock by size</legend>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SIZES.map((s) => {
            const field = `stock${s}` as const
            return (
              <div key={s} className="space-y-1.5">
                <label htmlFor={field} className="text-sm font-medium">
                  {s}
                </label>
                <input
                  id={field}
                  name={field}
                  type="number"
                  step="1"
                  min="0"
                  required
                  defaultValue={defaultValues?.[field]}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
            )
          })}
        </div>
      </fieldset>

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

      <ImageUploadField name="image" defaultValue={defaultValues?.image} />

      <fieldset className="space-y-5 rounded-md border border-input p-4">
        <legend className="px-1 text-sm font-semibold">Hero appearance</legend>
        <p className="text-xs text-muted-foreground">
          Controls how this jersey looks in the home page hero. Anything left blank is derived
          automatically from the product name and image.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="club" className="text-sm font-medium">
              Club display name
            </label>
            <input
              id="club"
              name="club"
              defaultValue={defaultValues?.club}
              placeholder="Auto from name"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="season" className="text-sm font-medium">
              Season
            </label>
            <input
              id="season"
              name="season"
              defaultValue={defaultValues?.season}
              placeholder="Auto from name"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ColorField name="heroBg" label="Background color" defaultValue={defaultValues?.heroBg} />
          <ColorField name="heroAccent" label="Accent color" defaultValue={defaultValues?.heroAccent} />
        </div>
      </fieldset>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
