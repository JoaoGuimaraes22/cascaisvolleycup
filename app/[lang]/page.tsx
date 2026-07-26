import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, hasLocale } from './dictionaries'
import LandingWelcome from './_components/landing/welcome'
import LandingLocation from './_components/landing/location'
import { buildPageMetadata } from './_lib/seo'

export const revalidate = 86400

export async function generateMetadata({
  params
}: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params

  if (!hasLocale(lang)) return {}

  const dict = await getDictionary(lang)
  const w = dict.LandingPage.Welcome
  const title = 'Cascais VolleyCup 2027'

  return {
    ...buildPageMetadata(lang, {
      title,
      description: `${w.heading} — Cascais, ${w.PORTUGAL}. ${w.dates}`,
      path: ''
    }),
    title: { absolute: title }
  }
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params

  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <div className='bg-white'>
      <LandingWelcome lang={lang} dict={dict.LandingPage.Welcome} />
      <LandingLocation
        dict={dict.LandingPage.Location}
        registrationFormDict={dict.RegistrationPage.Form}
      />
    </div>
  )
}
