import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { auth } from '@/auth'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'Image must be smaller than 5MB' }, { status: 400 })
  }

  const blob = await put(`products/${crypto.randomUUID()}-${file.name}`, file, {
    access: 'public',
  })

  return NextResponse.json({ url: blob.url })
}
