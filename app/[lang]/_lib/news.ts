import 'server-only'
import { cache } from 'react'
import { sanityClient } from './sanity-client'
import { i18n, type Locale } from '@/i18n-config'

export type SanityImageRef = {
  _type?: 'image'
  asset?: { _ref?: string; _type?: string }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

export type NewsCardData = {
  _id: string
  title: string
  description: string
  slug: string
  image: SanityImageRef
  imageAlt: string | null
  publishedAt: string
}

export type NewsPostData = NewsCardData & {
  body: unknown
  alternateSlugs: Record<Locale, string>
}

const CARD_FIELDS = `
  _id,
  "title": coalesce(title[$lang], title.en),
  "description": coalesce(description[$lang], description.en),
  "slug": coalesce(slug[$lang].current, slug.en.current),
  "imageAlt": coalesce(imageAlt[$lang], imageAlt.en),
  image,
  publishedAt
`

export async function getAllPosts(lang: Locale): Promise<NewsCardData[]> {
  return sanityClient.fetch<NewsCardData[]>(
    `*[_type == "newsPost" && defined(slug.en.current)] | order(publishedAt desc) { ${CARD_FIELDS} }`,
    { lang }
  )
}

export const getPostBySlug = cache(
  async (lang: Locale, slug: string): Promise<NewsPostData | null> =>
    sanityClient.fetch<NewsPostData | null>(
      `*[_type == "newsPost" && (slug[$lang].current == $slug || slug.en.current == $slug)][0]{
      ${CARD_FIELDS},
      "body": coalesce(body[$lang], body.en),
      "alternateSlugs": {
        "en": slug.en.current,
        "pt": coalesce(slug.pt.current, slug.en.current),
        "es": coalesce(slug.es.current, slug.en.current),
        "fr": coalesce(slug.fr.current, slug.en.current)
      }
    }`,
      { lang, slug }
    )
)

export async function getAllSlugsForStaticParams(): Promise<
  Array<{ lang: Locale; slug: string }>
> {
  const results = await sanityClient.fetch<
    Array<Partial<Record<Locale, string | null>>>
  >(
    `*[_type == "newsPost" && defined(slug.en.current)]{
      "en": slug.en.current,
      "pt": slug.pt.current,
      "es": slug.es.current,
      "fr": slug.fr.current
    }`
  )

  const params: Array<{ lang: Locale; slug: string }> = []
  for (const row of results) {
    const en = row.en
    if (!en) continue
    for (const lang of i18n.locales) {
      const slug = row[lang] ?? en
      params.push({ lang, slug })
    }
  }
  return params
}
