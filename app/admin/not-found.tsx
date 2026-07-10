import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-xl font-semibold">Not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The item you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Link href="/admin" className="text-sm underline underline-offset-4">
        Back to dashboard
      </Link>
    </div>
  )
}
