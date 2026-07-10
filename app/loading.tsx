import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <Loader2 className="size-8 animate-spin text-white/40" strokeWidth={1.5} />
    </main>
  )
}
