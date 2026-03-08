import type { MetadataRoute } from 'next'

const BASE_URL = 'https://cascaisvolley.com'
const locales = ['en', 'pt', 'es', 'fr']

const routes = [
  { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
  { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/program', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/competition', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/registration', changeFrequency: 'weekly' as const, priority: 0.9 },
  { path: '/accommodation', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/location', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/gallery', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/gallery/2025', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/gallery/2024', changeFrequency: 'yearly' as const, priority: 0.5 },
  { path: '/gallery/2023', changeFrequency: 'yearly' as const, priority: 0.5 },
  { path: '/hall-of-fame', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/news', changeFrequency: 'weekly' as const, priority: 0.7 }
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const route of routes) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${BASE_URL}/${l}${route.path}`])
          )
        }
      })
    }
  }

  return entries
}
