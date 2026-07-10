export default function Loading() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      <div className="relative mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <div className="mb-10 h-3 w-24 animate-pulse rounded-full bg-white/10" />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-3/4 animate-pulse rounded-3xl border border-white/8 bg-white/5" />

          <div className="flex flex-col justify-center gap-4">
            <div className="h-3 w-40 animate-pulse rounded-full bg-white/10" />
            <div className="h-12 w-3/4 animate-pulse rounded-full bg-white/10" />
            <div className="h-8 w-32 animate-pulse rounded-full bg-white/10" />
            <div className="mt-6 h-32 animate-pulse rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    </main>
  )
}
