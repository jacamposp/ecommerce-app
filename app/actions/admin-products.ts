'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/require-admin'

export type ProductFormState = { error: string } | undefined

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function isUniqueConstraintError(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002'
}

function isForeignKeyError(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2003'
}

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/

type ParsedProduct =
  | { ok: false; error: string }
  | {
      ok: true
      data: {
        name: string
        slug: string
        description: string | null
        price: number
        stock: number
        image: string | null
        category: string | null
        club: string | null
        season: string | null
        heroBg: string | null
        heroAccent: string | null
      }
    }

function parseProductForm(formData: FormData): ParsedProduct {
  const name = String(formData.get('name') ?? '').trim()
  const slugInput = String(formData.get('slug') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const priceRaw = String(formData.get('price') ?? '')
  const stockRaw = String(formData.get('stock') ?? '')
  const image = String(formData.get('image') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim()
  const club = String(formData.get('club') ?? '').trim()
  const season = String(formData.get('season') ?? '').trim()
  const heroBg = String(formData.get('heroBg') ?? '').trim()
  const heroAccent = String(formData.get('heroAccent') ?? '').trim()

  if (!name) return { ok: false, error: 'Name is required.' }

  if (heroBg && !HEX_COLOR_RE.test(heroBg)) {
    return { ok: false, error: 'Hero background must be a hex color like #1A5276.' }
  }
  if (heroAccent && !HEX_COLOR_RE.test(heroAccent)) {
    return { ok: false, error: 'Hero accent must be a hex color like #B0E2FA.' }
  }

  const price = Number(priceRaw)
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, error: 'Price must be a positive number.' }
  }

  const stock = Number(stockRaw)
  if (!Number.isInteger(stock) || stock < 0) {
    return { ok: false, error: 'Stock must be a whole, non-negative number.' }
  }

  const slug = slugify(slugInput || name)
  if (!slug) return { ok: false, error: 'Could not derive a valid slug from the name.' }

  return {
    ok: true,
    data: {
      name,
      slug,
      description: description || null,
      price,
      stock,
      image: image || null,
      category: category || null,
      club: club || null,
      season: season || null,
      heroBg: heroBg || null,
      heroAccent: heroAccent || null,
    },
  }
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin()

  const parsed = parseProductForm(formData)
  if (!parsed.ok) return { error: parsed.error }

  try {
    await prisma.product.create({ data: parsed.data })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: 'A product with that slug already exists.' }
    }
    console.error('Create product error:', error)
    return { error: 'Failed to create product.' }
  }

  revalidatePath('/')
  revalidatePath('/admin/products')
  revalidatePath('/products')
  redirect('/admin/products')
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin()

  const parsed = parseProductForm(formData)
  if (!parsed.ok) return { error: parsed.error }

  try {
    await prisma.product.update({ where: { id: productId }, data: parsed.data })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: 'A product with that slug already exists.' }
    }
    console.error('Update product error:', error)
    return { error: 'Failed to update product.' }
  }

  revalidatePath('/')
  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath(`/products/${parsed.data.slug}`)
  redirect('/admin/products')
}

export type DeleteProductState = { error: string } | undefined

export async function deleteProduct(
  productId: string,
  _prevState: DeleteProductState,
): Promise<DeleteProductState> {
  await requireAdmin()

  try {
    await prisma.product.delete({ where: { id: productId } })
  } catch (error) {
    if (isForeignKeyError(error)) {
      return { error: 'This product is referenced by existing orders and cannot be deleted.' }
    }
    console.error('Delete product error:', error)
    return { error: 'Failed to delete product.' }
  }

  revalidatePath('/')
  revalidatePath('/admin/products')
  revalidatePath('/products')
  return undefined
}
