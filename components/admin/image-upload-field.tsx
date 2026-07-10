'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ImageUploadField({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue ?? '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Upload failed')
        return
      }

      setUrl(data.url)
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Image</label>

      <div className="flex items-start gap-4">
        <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-input bg-muted">
          {url ? (
            <Image src={url} alt="" fill sizes="96px" className="object-cover" />
          ) : (
            <ImagePlus className="size-6 text-muted-foreground" strokeWidth={1.5} />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-md border border-input bg-transparent px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
            >
              {url ? 'Replace image' : 'Upload image'}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
                Remove
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Or paste an image URL"
            className={cn(
              'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
            )}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>

      <input type="hidden" name={name} value={url} />
    </div>
  )
}
