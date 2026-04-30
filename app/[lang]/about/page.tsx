import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, hasLocale } from '../dictionaries'
import AboutHero from '../_components/about/hero'
import AboutPortugal from '../_components/about/portugal'
import AboutVilla from '../_components/about/villa'
import JsonLd from '../_components/json-ld'
import { buildPageMetadata, buildPageGraph, breadcrumbLabel } from '../_lib/seo'

export const revalidate = 86400

export async function generateMetadata({
  params
}: PageProps<'/[lang]/about'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang)

  return buildPageMetadata(lang, {
    title: dict.AboutPage.Hero.title,
    description: dict.AboutPage.Hero.p1,
    path: '/about'
  })
}

export default async function AboutPage({
  params
}: PageProps<'/[lang]/about'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  const jsonLd = buildPageGraph(lang, {
    type: 'AboutPage',
    path: '/about',
    name: dict.AboutPage.Hero.title,
    description: dict.AboutPage.Hero.p1,
    eventRef: 'mainEntity',
    breadcrumb: [{ name: breadcrumbLabel(lang, 'about'), path: '/about' }]
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <AboutHero dict={dict.AboutPage.Hero} />
      <AboutPortugal dict={dict.AboutPage.Portugal} />
      <AboutVilla dict={dict.AboutPage.Villa} />
    </>
  )
}
