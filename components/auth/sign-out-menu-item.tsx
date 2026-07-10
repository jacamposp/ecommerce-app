'use client'

import { signOutAction } from '@/app/actions/auth'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function SignOutMenuItem() {
  return <DropdownMenuItem onClick={() => signOutAction()}>Sign out</DropdownMenuItem>
}
