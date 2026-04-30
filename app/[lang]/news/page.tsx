import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../dictionaries'
import JsonLd from '../_components/json-ld'
import { buildPageMetadata, buildPageGraph, breadcrumbLabel } from '../_lib/seo'

export const revalidate = 86400

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

  const jsonLd = buildPageGraph(lang, {
    type: 'WebPage',
    path: '/news',
    name: dict.NewsPage.title,
    breadcrumb: [{ name: breadcrumbLabel(lang, 'news'), path: '/news' }]
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className='px-32 py-24 text-center text-2xl'>
        {dict.NewsPage.comingSoon}
      </div>
    </>
  )
}
