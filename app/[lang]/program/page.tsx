import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../dictionaries'
import ProgramHero from '../_components/program/hero'
import JsonLd from '../_components/json-ld'
import { buildPageMetadata, buildPageGraph, breadcrumbLabel } from '../_lib/seo'

export const revalidate = 86400

export async function generateMetadata({
  params
}: PageProps<'/[lang]/program'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  const hero = dict.ProgramPage.Hero

  return buildPageMetadata(lang, {
    title: hero.title,
    description: `Cascais Volley Cup 2027 — ${hero.title}. ${hero.checkin.label}, ${hero.checkout.label}.`,
    path: '/program'
  })
}

export default async function ProgramPage({
  params
}: PageProps<'/[lang]/program'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const hero = dict.ProgramPage.Hero

  const jsonLd = buildPageGraph(lang, {
    type: 'WebPage',
    path: '/program',
    name: hero.title,
    description: `Cascais Volley Cup 2027 — ${hero.title}. ${hero.checkin.label}, ${hero.checkout.label}.`,
    eventRef: 'mainEntity',
    breadcrumb: [{ name: breadcrumbLabel(lang, 'program'), path: '/program' }]
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <div>
        <ProgramHero lang={lang} dict={dict.ProgramPage.Hero} />
      </div>
    </>
  )
}
