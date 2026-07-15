'use client'

import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SORT_OPTIONS, type SortValue } from '@/lib/product-sort'

export function SortMenu({ current, category }: { current: SortValue; category: string }) {
  const router = useRouter()
  const currentLabel = SORT_OPTIONS.find((option) => option.value === current)?.label ?? 'Featured'

  function handleChange(value: unknown) {
    const params = new URLSearchParams()
    if (category !== 'All') params.set('category', category)
    if (value !== 'featured') params.set('sort', String(value))
    const query = params.toString()
    router.push(query ? `/products?${query}` : '/products')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 self-start rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 transition-colors hover:border-white/30 hover:text-white sm:self-auto">
        Sort: {currentLabel}
        <span className="text-white/40" aria-hidden>
          ▾
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuRadioGroup value={current} onValueChange={handleChange}>
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
