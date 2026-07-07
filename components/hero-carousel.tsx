'use client'

import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { HeroSlide } from '@/lib/hero-slide'

type JerseyRole = 'center' | 'left' | 'right' | 'back'

const ANIMATION_MS = 650

function getRole(index: number, activeIndex: number, total: number): JerseyRole {
  const diff = (index - activeIndex + total) % total
  if (diff === 0) return 'center'
  if (diff === 1) return 'right'
  if (diff === total - 1) return 'left'
  return 'back'
}

function StadiumGrain() {
  return (
    <svg className="pointer-events-none absolute inset-0 z-3 h-full w-full opacity-[0.18]" aria-hidden>
      <filter id="stadium-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#stadium-grain)" />
    </svg>
  )
}

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [contentKey, setContentKey] = useState(0)

  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image()
      img.src = slide.image
    })
  }, [slides])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating || slides.length === 0) return
      setIsAnimating(true)
      setContentKey((k) => k + 1)
      setActiveIndex((prev) => {
        const total = slides.length
        return direction === 'next' ? (prev + 1) % total : (prev - 1 + total) % total
      })
      setTimeout(() => setIsAnimating(false), ANIMATION_MS)
    },
    [isAnimating, slides.length],
  )

  if (slides.length === 0) return null

  const active = slides[activeIndex]
  const bgText = active.club
  const bgTagline = activeIndex % 2 === 0 ? 'AUTHENTIC MATCHDAY GEAR' : 'NEW SEASON DROP'

  const getJerseyStyles = (role: JerseyRole): CSSProperties => {
    const mobile = isMobile

    const base: CSSProperties = {
      position: 'absolute',
      aspectRatio: '0.75 / 1',
      transition: `transform ${ANIMATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${ANIMATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), filter ${ANIMATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.55))',
    }

    switch (role) {
      case 'center':
        return {
          ...base,
          width: mobile ? '54vw' : '30vw',
          maxWidth: mobile ? '300px' : '420px',
          left: '50%',
          top: mobile ? '18%' : '20%',
          transform: 'translateX(-50%) translateY(0) scale(1)',
          opacity: 1,
          zIndex: 40,
          filter: `${base.filter} blur(0px) brightness(1.05)`,
        }
      case 'left':
        return {
          ...base,
          width: mobile ? '30vw' : '14vw',
          maxWidth: mobile ? '140px' : '200px',
          left: mobile ? '0%' : '6%',
          top: mobile ? '32%' : '30%',
          transform: mobile
            ? 'translateX(0) translateY(0) scale(0.8)'
            : 'translateX(0) translateY(10px) scale(0.78) rotate(-8deg)',
          opacity: mobile ? 0.35 : 0.45,
          zIndex: 25,
          filter: `${base.filter} blur(2px) brightness(0.85)`,
        }
      case 'right':
        return {
          ...base,
          width: mobile ? '30vw' : '14vw',
          maxWidth: mobile ? '140px' : '200px',
          right: mobile ? '0%' : '6%',
          left: 'auto',
          top: mobile ? '32%' : '30%',
          transform: mobile
            ? 'translateX(0) translateY(0) scale(0.8)'
            : 'translateX(0) translateY(10px) scale(0.78) rotate(8deg)',
          opacity: mobile ? 0.35 : 0.45,
          zIndex: 25,
          filter: `${base.filter} blur(2px) brightness(0.85)`,
        }
      case 'back':
        return {
          ...base,
          width: mobile ? '36vw' : '16vw',
          maxWidth: mobile ? '160px' : '220px',
          left: '50%',
          top: mobile ? '28%' : '26%',
          transform: 'translateX(-50%) translateY(24px) scale(0.65)',
          opacity: 0.15,
          zIndex: 15,
          filter: `${base.filter} blur(10px)`,
        }
    }
  }

  return (
    <section
      className="relative h-screen overflow-hidden"
      style={{
        backgroundColor: active.bg,
        transition: `background-color ${ANIMATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <StadiumGrain />

      {/* Tagline above giant text */}
      <p
        className="pointer-events-none absolute left-0 right-0 z-12 select-none text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70 md:text-xs"
        style={{ top: isMobile ? '10%' : '8%' }}
      >
        {bgTagline}
      </p>

      {/* Giant background text — bold white, product sits on top */}
      <div
        className="hero-content-animate pointer-events-none absolute left-0 right-0 z-12 select-none overflow-hidden px-2 text-center uppercase"
        style={{
          top: isMobile ? '13%' : '10%',
          fontFamily: "'Anton', sans-serif",
          fontSize: isMobile ? 'clamp(64px, 20vw, 140px)' : 'clamp(100px, 16vw, 340px)',
          fontWeight: 400,
          color: '#ffffff',
          letterSpacing: '-0.04em',
          lineHeight: 0.9,
          textShadow: `0 0 80px ${active.accent}66, 0 0 160px ${active.accent}33, 0 12px 40px rgba(0,0,0,0.45)`,
          transition: `text-shadow ${ANIMATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
        key={`bgtext-${contentKey}`}
      >
        {bgText}
      </div>

      {/* Top left brand */}
      <div className="absolute left-6 top-6 z-40 flex items-center gap-2.5 md:left-10 md:top-10 md:gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-icon.png"
          alt="Elite Football"
          className="h-9 w-9 object-contain md:h-11 md:w-11"
          draggable={false}
        />
        <p
          className="text-xs font-bold uppercase tracking-[0.2em] text-white md:text-sm"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Elite Football
        </p>
      </div>

      {/* Jersey carousel area */}
      <div className="absolute inset-0 z-20">
        {/* Stadium lights glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-[16%] z-18 h-[50vh] w-[70vw] -translate-x-1/2 rounded-full md:top-[18%]"
          style={{
            background: `radial-gradient(circle, ${active.accent}22 0%, rgba(255,255,255,0.12) 30%, transparent 70%)`,
            transition: `background ${ANIMATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        />

        {/* Jerseys */}
        {slides.map((slide, index) => {
          const role = getRole(index, activeIndex, slides.length)
          return (
            <div key={slide.id} className="overflow-hidden" style={getJerseyStyles(role)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={`${slide.club} ${slide.name}`}
                className="h-full w-full object-cover object-top"
                draggable={false}
              />
            </div>
          )
        })}
      </div>

      {/* Center product information */}
      <div
        className="hero-content-animate absolute left-1/2 z-40 flex -translate-x-1/2 flex-col items-center text-center text-white"
        style={{
          top: isMobile ? '66%' : '64%',
        }}
        key={`info-${contentKey}`}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.3em] md:text-base" style={{ color: active.accent }}>
          {active.name}
        </p>
        <p className="mt-1 text-xs font-medium uppercase tracking-widest opacity-60 md:text-sm">
          {active.season} Season
        </p>

        {/* Accent line */}
        <div
          className="mt-3 h-[2px]"
          style={{
            width: '120px',
            background: active.accent,
            transition: `background ${ANIMATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        />

        <p
          className="mt-3 text-2xl font-bold md:text-3xl"
          style={{
            color: active.accent,
            transition: `color ${ANIMATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        >
          {active.price}
        </p>
      </div>

      {/* Bottom left content + navigation */}
      <div className="absolute bottom-8 left-6 z-40 max-w-xs md:bottom-12 md:left-10 md:max-w-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide md:text-base" style={{ color: active.accent }}>
          {active.name}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-white/60 md:text-sm">
          Engineered for performance and designed for supporters. Discover official kits inspired by the world&apos;s
          biggest clubs and competitions.
        </p>
        <div className="mt-5 flex gap-3 md:mt-6 md:gap-4">
          <button
            type="button"
            onClick={() => navigate('prev')}
            disabled={isAnimating}
            aria-label="Previous jersey"
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white text-white transition-all duration-300 hover:scale-[1.08] hover:bg-white/10 disabled:opacity-50"
          >
            <ArrowLeft size={24} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => navigate('next')}
            disabled={isAnimating}
            aria-label="Next jersey"
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white text-white transition-all duration-300 hover:scale-[1.08] hover:bg-white/10 disabled:opacity-50"
          >
            <ArrowRight size={24} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Bottom right CTA */}
      <a
        href="#products"
        className="group absolute bottom-8 right-6 z-40 flex items-center gap-2 text-white opacity-80 transition-all duration-300 hover:opacity-100 md:bottom-12 md:right-10 md:gap-3"
      >
        <span
          className="uppercase"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(24px, 4vw, 64px)',
            letterSpacing: '-0.02em',
          }}
        >
          Shop Now
        </span>
        <ArrowRight size={32} className="transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
      </a>
    </section>
  )
}
