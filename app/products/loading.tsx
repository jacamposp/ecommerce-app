export default function Loading() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="mb-12 md:mb-16">
          <div className="h-3 w-40 animate-pulse rounded-full bg-white/10" />
          <div className="mt-3 h-10 w-56 animate-pulse rounded-full bg-white/10 md:h-12 md:w-72" />
        </div>

        <div className="mb-10 h-10 w-full animate-pulse rounded-full bg-white/5" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl border border-white/8 bg-white/3"
            >
              <div className="aspect-3/4 bg-white/5" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-3/4 rounded-full bg-white/10" />
                <div className="h-5 w-1/3 rounded-full bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
