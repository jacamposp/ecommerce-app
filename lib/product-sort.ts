export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]['value']

export function parseSortValue(value: string | undefined): SortValue {
  return SORT_OPTIONS.some((option) => option.value === value) ? (value as SortValue) : 'featured'
}
