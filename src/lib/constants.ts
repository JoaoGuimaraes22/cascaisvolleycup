// src/lib/constants.ts
// Shared constants used across multiple components

/** Standard wave overlay height used across Hero sections */
export const WAVE_HEIGHT = 135

/** Hall of Fame hero uses a taller wave */
export const WAVE_HEIGHT_TALL = 150

/** Production site URL */
export const SITE_URL = 'https://cascaisvolley.com'

/** Shared blur placeholder for background images (tiny 1x1 JPEG) */
export const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

/** Shared global asset paths */
export const GLOBAL_ASSETS = {
  wave: '/img/global/ondas-3.webp',
  tagline: '/img/global/tagline.webp',
  taglineWhite: '/img/global/tagline-w.webp',
  logo: '/img/global/cascais-volley-cup-2.webp',
  logoWhite: '/img/global/cascais-volley-cup-1-w.webp'
} as const

/** Language code mapping for brochure file naming */
export const LANGUAGE_CODES = {
  en: 'UK',
  es: 'ESP',
  pt: 'PT',
  fr: 'FRAN'
} as const

/** Get brochure filename for a given locale */
export function getBrochureFileName(locale: string): string {
  const langCode = LANGUAGE_CODES[locale as keyof typeof LANGUAGE_CODES] || 'UK'
  return `CVCUP-2026-CONVITE-${langCode}.pdf`
}
