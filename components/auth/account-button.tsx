import Image from 'next/image'
import Link from 'next/link'
import { UserRound } from 'lucide-react'
import { auth } from '@/auth'
import { signInWithGoogle } from '@/app/actions/auth'

export async function AccountButton() {
  const session = await auth()

  if (!session?.user) {
    return (
      <form action={signInWithGoogle} className="fixed top-6 right-24 z-50">
        <button
          type="submit"
          className="flex size-12 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-black/60"
          aria-label="Sign in"
          title="Sign in"
        >
          <UserRound className="size-5" strokeWidth={1.75} />
        </button>
      </form>
    )
  }

  return (
    <Link
      href="/account/orders"
      className="fixed top-6 right-24 z-50 flex size-12 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-black/60"
      aria-label={`Account, signed in as ${session.user.name}`}
      title={`${session.user.name} — Order history`}
    >
      {session.user.image ? (
        <Image
          src={session.user.image}
          alt={session.user.name ?? 'Account'}
          width={48}
          height={48}
          className="size-full object-cover"
        />
      ) : (
        <UserRound className="size-5" strokeWidth={1.75} />
      )}
    </Link>
  )
}
