import Image from 'next/image'
import Link from 'next/link'
import { PackageOpen, ShieldCheck, UserRound } from 'lucide-react'
import { auth } from '@/auth'
import { signInWithGoogle } from '@/app/actions/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutMenuItem } from '@/components/auth/sign-out-menu-item'

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
    <DropdownMenu>
      <DropdownMenuTrigger
        className="fixed top-6 right-24 z-50 flex size-12 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-black/60"
        aria-label={`Account menu, signed in as ${session.user.name}`}
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
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{session.user.name ?? session.user.email}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/account/orders" />}>
          <PackageOpen className="size-4" strokeWidth={1.75} />
          Order history
        </DropdownMenuItem>

        {session.user.role === 'ADMIN' && (
          <DropdownMenuItem render={<Link href="/admin" />}>
            <ShieldCheck className="size-4" strokeWidth={1.75} />
            Admin panel
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <SignOutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
