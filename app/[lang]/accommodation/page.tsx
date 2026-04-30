import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../dictionaries'
import AccommodationHero from '../_components/accommodation/hero'
import JsonLd from '../_components/json-ld'
import { buildPageMetadata, buildPageGraph, breadcrumbLabel } from '../_lib/seo'

export const revalidate = 86400

export async function generateMetadata({
  params
}: PageProps<'/[lang]/accommodation'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  const hero = dict.AccommodationPage.Hero

  return buildPageMetadata(lang, {
    title: hero.title,
    description: hero.schools.p1,
    path: '/accommodation'
  })
}

export default async function AccommodationPageRoute({
  params
}: PageProps<'/[lang]/accommodation'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const hero = dict.AccommodationPage.Hero

  const jsonLd = buildPageGraph(lang, {
    type: 'WebPage',
    path: '/accommodation',
    name: hero.title,
    description: hero.schools.p1,
    eventRef: 'mainEntity',
    breadcrumb: [
      { name: breadcrumbLabel(lang, 'accommodation'), path: '/accommodation' }
    ]
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <AccommodationHero
        dict={dict.AccommodationPage.Hero}
        contactToastDict={dict.ContactModal}
      />
    </>
  )
}
