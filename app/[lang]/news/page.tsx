import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../dictionaries'
import JsonLd from '../_components/json-ld'
import SectionWave from '../_components/global/section-wave'
import SectionWaveTop from '../_components/global/section-wave-top'
import NewsHero from '../_components/news/hero'
import NewsList from '../_components/news/list'
import NewsEmpty from '../_components/news/empty'
import { getAllPosts } from '../_lib/news'
import { buildPageMetadata, buildPageGraph, breadcrumbLabel } from '../_lib/seo'
import { WAVE_HEIGHT } from '../_lib/constants'

export const revalidate = 3600

export async function generateMetadata({
  params
}: PageProps<'/[lang]/news'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)

  return buildPageMetadata(lang, {
    title: dict.NewsPage.title,
    description: dict.NewsPage.description,
    path: '/news'
  })
}

export default async function NewsPage({ params }: PageProps<'/[lang]/news'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const posts = await getAllPosts(lang)

  const jsonLd = buildPageGraph(lang, {
    type: 'CollectionPage',
    path: '/news',
    name: dict.NewsPage.title,
    description: dict.NewsPage.description,
    breadcrumb: [{ name: breadcrumbLabel(lang, 'news'), path: '/news' }]
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <section
        className='relative isolate overflow-hidden bg-white pt-[60px] sm:pt-[80px] lg:pt-[120px]'
        style={{ paddingBottom: `${WAVE_HEIGHT}px` }}
      >
        <SectionWaveTop />
        <NewsHero dict={dict.NewsPage} />
        {posts.length > 0 ? (
          <NewsList lang={lang} posts={posts} dict={dict.NewsPage} />
        ) : (
          <NewsEmpty dict={dict.NewsPage} />
        )}
        <SectionWave />
      </section>
    </>
  )
}
