export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16 text-white md:px-10 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 h-3 w-32 animate-pulse rounded-full bg-white/10" />

        <div className="mb-12 flex items-start justify-between gap-4">
          <div>
            <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
            <div className="mt-3 h-10 w-56 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-white/8 bg-white/3" />
          ))}
        </div>
      </div>
    </main>
  )
}
