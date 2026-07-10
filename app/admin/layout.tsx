import Link from 'next/link'
import { requireAdmin } from '@/lib/require-admin'
import { AdminNav } from '@/components/admin/admin-nav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-sm font-semibold uppercase tracking-widest">
              Admin
            </Link>
            <AdminNav />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{session.user.email}</span>
            <Link href="/products" className="underline underline-offset-4 hover:text-foreground">
              View store
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  )
}
