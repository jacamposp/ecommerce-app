export type HeroColors = {
  bg: string
  accent: string
}

export const DEFAULT_HERO_COLORS: HeroColors = {
  bg: '#0a0a0a',
  accent: '#ffffff',
}

const SAMPLE_SIZE = 40

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2

  if (max === min) return [0, 0, l]

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h: number
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6

  return [h, s, l]
}

function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number) => {
    let tn = t
    if (tn < 0) tn += 1
    if (tn > 1) tn -= 1
    if (tn < 1 / 6) return p + (q - p) * 6 * tn
    if (tn < 1 / 2) return q
    if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6
    return p
  }

  let r: number
  let g: number
  let b: number
  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Extracts a dominant color from a jersey image and returns hero colors:
 * a dark background tone and a vivid accent, both derived from that color.
 * Rejects on load/CORS/canvas failures — callers should fall back to
 * DEFAULT_HERO_COLORS.
 */
export function extractHeroColors(src: string): Promise<HeroColors> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = SAMPLE_SIZE
        canvas.height = SAMPLE_SIZE
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) throw new Error('Canvas 2D context unavailable')

        ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE)
        const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE)

        // Bucket hues of sufficiently saturated, non-extreme-lightness pixels
        // and pick the most common one, tracking its average saturation.
        const HUE_BUCKETS = 24
        const counts = new Array<number>(HUE_BUCKETS).fill(0)
        const satSums = new Array<number>(HUE_BUCKETS).fill(0)

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue
          const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2])
          if (s < 0.25 || l < 0.08 || l > 0.92) continue
          const bucket = Math.min(HUE_BUCKETS - 1, Math.floor(h * HUE_BUCKETS))
          counts[bucket] += 1
          satSums[bucket] += s
        }

        const best = counts.indexOf(Math.max(...counts))
        if (counts[best] === 0) {
          // No saturated pixels (white/black/grey jersey) — keep the neutral look.
          resolve(DEFAULT_HERO_COLORS)
          return
        }

        const hue = (best + 0.5) / HUE_BUCKETS
        const sat = Math.min(1, satSums[best] / counts[best])

        resolve({
          bg: hslToHex(hue, Math.min(0.65, sat), 0.18),
          accent: hslToHex(hue, Math.max(0.55, sat), 0.68),
        })
      } catch (error) {
        reject(error)
      }
    }

    img.src = src
  })
}
