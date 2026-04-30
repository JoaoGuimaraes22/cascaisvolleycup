import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../dictionaries'
import CompetitionHero from '../_components/competition/hero'
import CompetitionFacts from '../_components/competition/facts'
import CompetitionInfo from '../_components/competition/info'
import JsonLd from '../_components/json-ld'
import { buildPageMetadata, buildPageGraph, breadcrumbLabel } from '../_lib/seo'

export const revalidate = 86400

export async function generateMetadata({
  params
}: PageProps<'/[lang]/competition'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)
  const hero = dict.CompetitionPage.Hero

  return buildPageMetadata(lang, {
    title: hero.title,
    description: hero.p1,
    path: '/competition'
  })
}

export default async function CompetitionPage({
  params
}: PageProps<'/[lang]/competition'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const hero = dict.CompetitionPage.Hero

  const jsonLd = buildPageGraph(lang, {
    type: 'WebPage',
    path: '/competition',
    name: hero.title,
    description: hero.p1,
    eventRef: 'mainEntity',
    breadcrumb: [
      { name: breadcrumbLabel(lang, 'competition'), path: '/competition' }
    ]
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <CompetitionHero
        dict={dict.CompetitionPage.Hero}
        logoDict={dict.CompetitionPage.LogoTaglineHero}
      />
      <CompetitionFacts dict={dict.CompetitionPage.Facts} />
      <CompetitionInfo dict={dict.CompetitionPage.Info} />
    </>
  )
}
