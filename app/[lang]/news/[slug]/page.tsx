import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { i18n } from '@/i18n-config'
import { getDictionary, hasLocale } from '../../dictionaries'
import JsonLd from '../../_components/json-ld'
import SectionWave from '../../_components/global/section-wave'
import SectionWaveTop from '../../_components/global/section-wave-top'
import NewsArticle from '../../_components/news/article'
import { getPostBySlug, getAllSlugsForStaticParams } from '../../_lib/news'
import {
  SITE_URL,
  bcp47Locale,
  schemaIds,
  buildPageMetadata,
  buildBreadcrumb,
  breadcrumbLabel
} from '../../_lib/seo'
import { urlFor } from '../../_lib/sanity-image'
import { WAVE_HEIGHT, NEWS_IMAGE } from '../../_lib/constants'

export const revalidate = 3600

export async function generateStaticParams() {
  return getAllSlugsForStaticParams()
}

export async function generateMetadata({
  params
}: PageProps<'/[lang]/news/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}
  const post = await getPostBySlug(lang, slug)
  if (!post) return {}

  const heroUrl = urlFor(post.image)
    .width(NEWS_IMAGE.og.width)
    .height(NEWS_IMAGE.og.height)
    .fit('crop')
    .url()

  const base = buildPageMetadata(lang, {
    title: post.title,
    description: post.description,
    path: `/news/${post.slug}`,
    image: heroUrl
  })

  const languages: Record<string, string> = {}
  for (const l of i18n.locales) {
    languages[l] = `/${l}/news/${post.alternateSlugs[l]}`
  }
  languages['x-default'] =
    `/${i18n.defaultLocale}/news/${post.alternateSlugs[i18n.defaultLocale]}`

  return {
    ...base,
    alternates: {
      canonical: `/${lang}/news/${post.slug}`,
      languages
    }
  }
}

export default async function NewsDetailPage({
  params
}: PageProps<'/[lang]/news/[slug]'>) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const post = await getPostBySlug(lang, slug)
  if (!post) notFound()
  const dict = await getDictionary(lang)

  const ids = schemaIds(lang)
  const url = `${SITE_URL}/${lang}/news/${post.slug}`
  const articleId = `${url}#article`
  const breadcrumbId = `${url}#breadcrumb`
  const heroUrl = urlFor(post.image)
    .width(NEWS_IMAGE.og.width)
    .height(NEWS_IMAGE.og.height)
    .fit('crop')
    .url()

  const breadcrumb = {
    ...buildBreadcrumb(lang, [
      { name: breadcrumbLabel(lang, 'news'), path: '/news' },
      { name: post.title, path: `/news/${post.slug}` }
    ]),
    '@id': breadcrumbId
  }

  const articleNode = {
    '@type': 'Article',
    '@id': articleId,
    headline: post.title,
    description: post.description,
    inLanguage: bcp47Locale(lang),
    url,
    image: heroUrl,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    isPartOf: { '@id': ids.website },
    mainEntityOfPage: { '@id': articleId },
    breadcrumb: { '@id': breadcrumbId },
    author: { '@id': ids.organization },
    publisher: { '@id': ids.organization }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [articleNode, breadcrumb]
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <section
        className='relative isolate overflow-hidden bg-white pt-[60px] sm:pt-[80px] lg:pt-[120px]'
        style={{ paddingBottom: `${WAVE_HEIGHT}px` }}
      >
        <SectionWaveTop />
        <NewsArticle lang={lang} post={post} dict={dict.NewsPage} />
        <SectionWave />
      </section>
    </>
  )
}
