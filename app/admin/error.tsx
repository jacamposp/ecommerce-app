'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred while loading this page.
      </p>
      <div className="flex items-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/admin" className="text-sm text-muted-foreground hover:underline">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
