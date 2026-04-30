import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../dictionaries'
import GalleryHero from '../_components/gallery/hero'
import JsonLd from '../_components/json-ld'
import { buildPageMetadata, buildPageGraph, breadcrumbLabel } from '../_lib/seo'

export const revalidate = 86400

export async function generateMetadata({
  params
}: PageProps<'/[lang]/gallery'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)

  return buildPageMetadata(lang, {
    title: dict.GalleryPage.title,
    description: dict.GalleryPage.metaDescription,
    path: '/gallery'
  })
}

export default async function GalleryPageRoute({
  params
}: PageProps<'/[lang]/gallery'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  const jsonLd = buildPageGraph(lang, {
    type: 'CollectionPage',
    path: '/gallery',
    name: dict.GalleryPage.title,
    description: dict.GalleryPage.metaDescription,
    eventRef: 'about',
    breadcrumb: [{ name: breadcrumbLabel(lang, 'gallery'), path: '/gallery' }]
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <GalleryHero lang={lang} dict={dict.GalleryPage.Hero} />
    </>
  )
}
