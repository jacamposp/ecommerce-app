'use client'

import { useActionState } from 'react'
import { deleteProduct, type DeleteProductState } from '@/app/actions/admin-products'
import { Button } from '@/components/ui/button'

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [state, action, pending] = useActionState<DeleteProductState, FormData>(
    (prevState) => deleteProduct(productId, prevState),
    undefined,
  )

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(`Delete "${productName}"? This cannot be undone.`)) {
          event.preventDefault()
        }
      }}
      className="inline-flex flex-col items-end gap-1"
    >
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? 'Deleting…' : 'Delete'}
      </Button>
      {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
    </form>
  )
}
