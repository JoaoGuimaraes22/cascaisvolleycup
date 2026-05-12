import { bcp47Locale } from './seo'
import type { Locale } from '@/i18n-config'

export function formatNewsDate(iso: string, lang: Locale): string {
  return new Date(iso).toLocaleDateString(bcp47Locale(lang), {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
