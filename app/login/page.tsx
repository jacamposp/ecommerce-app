import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { signInWithGoogle } from '@/app/actions/auth'

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) {
    redirect('/')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-white">
      <div className="hero-content-animate flex flex-col items-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Welcome back</p>
        <h1
          className="mt-2 text-4xl uppercase text-white md:text-5xl"
          style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '-0.02em' }}
        >
          Sign in
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
          Sign in with your Google account to track orders and speed through checkout.
        </p>

        <form action={signInWithGoogle} className="mt-10">
          <button
            type="submit"
            className="inline-flex h-12 items-center gap-3 rounded-full bg-white px-8 text-sm font-semibold text-black transition-all hover:bg-white/90"
          >
            <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.6 5.6 0 0 1-2.41 3.63v3h3.9c2.28-2.1 3.53-5.2 3.53-8.87Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.96-2.9l-3.9-3a7.4 7.4 0 0 1-11-3.9H1.06v3.09A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.06 14.2a7.2 7.2 0 0 1 0-4.4V6.71H1.06a12 12 0 0 0 0 10.58Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.06 6.71l4 3.09A7.16 7.16 0 0 1 12 4.75Z"
              />
            </svg>
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  )
}
