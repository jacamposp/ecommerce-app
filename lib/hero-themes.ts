export type HeroTheme = {
  club: string
  bg: string
  accent: string
  season: string
}

export const HERO_THEMES: Record<string, HeroTheme> = {
  'home-kit-manchester-city-2026': { club: 'MAN. CITY', bg: '#1A5276', accent: '#B0E2FA', season: '2026' },
  'away-kit-real-madrid-2026': { club: 'MADRID', bg: '#111827', accent: '#E63946', season: '2026' },
  'third-kit-milan-2026': { club: 'MILAN', bg: '#1F1A0C', accent: '#C9A227', season: '2026' },
  'home-kit-chelsea-2026': { club: 'CHELSEA', bg: '#001E50', accent: '#034694', season: '2026' },
  'home-kit-barcelona-2026': { club: 'BARÇA', bg: '#0A1E5C', accent: '#A50044', season: '2026' },
  'away-kit-liverpool-2026': { club: 'LIVERPOOL', bg: '#111827', accent: '#C8102E', season: '2026' },
  'third-kit-psg-2026': { club: 'PSG', bg: '#0B1B3A', accent: '#004170', season: '2026' },
  'away-kit-bayern-munich-2026': { club: 'BAYERN', bg: '#111827', accent: '#DC052D', season: '2026' },
  'training-top-inter-2026': { club: 'INTER', bg: '#111827', accent: '#0068A8', season: '2026' },
  'retro-kit-arsenal-2004': { club: 'ARSENAL', bg: '#9C824A', accent: '#EF0107', season: '2004' },
}

export const DEFAULT_HERO_THEME: HeroTheme = {
  club: 'ELITE',
  bg: '#0a0a0a',
  accent: '#ffffff',
  season: '2026',
}

export function getHeroTheme(slug: string): HeroTheme {
  return HERO_THEMES[slug] ?? DEFAULT_HERO_THEME
}
