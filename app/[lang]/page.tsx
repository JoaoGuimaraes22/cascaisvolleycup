import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, hasLocale } from './dictionaries'
import LandingWelcome from './_components/landing/welcome'
import { buildPageMetadata } from './_lib/seo'

export const revalidate = 3600

export async function generateMetadata({
  params
}: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params

  if (!hasLocale(lang)) return {}

  const dict = await getDictionary(lang)
  const w = dict.LandingPage.Welcome
  const title = 'Cascais VolleyCup 2026'

  return {
    ...buildPageMetadata(lang, {
      title,
      description: `${w.heading} — Cascais, ${w.PORTUGAL}. ${w.dates}`,
      path: ''
    }),
    title: { absolute: title }
  }
}

const LandingUpdates = dynamic(() => import('./_components/landing/updates'), {
  loading: () => (
    <div className='relative min-h-96 bg-white'>
      <div className='motion-safe:animate-pulse'>
        <div className='mx-auto max-w-screen-xl px-4 py-16'>
          <div className='mb-8 h-8 w-48 rounded bg-slate-200' />
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[1, 2, 3].map(i => (
              <div key={i} className='space-y-4 rounded-xl bg-slate-100 p-6'>
                <div className='h-6 w-3/4 rounded bg-slate-200' />
                <div className='h-4 w-full rounded bg-slate-200' />
                <div className='h-4 w-5/6 rounded bg-slate-200' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

const LandingLocation = dynamic(
  () => import('./_components/landing/location'),
  {
    loading: () => (
      <div className='relative min-h-96 bg-white'>
        <div className='motion-safe:animate-pulse'>
          <div className='mx-auto max-w-screen-xl px-4 py-16'>
            <div className='mb-8 h-8 w-64 rounded bg-slate-200' />
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              <div className='space-y-4'>
                <div className='h-4 w-full rounded bg-slate-200' />
                <div className='h-4 w-5/6 rounded bg-slate-200' />
                <div className='h-4 w-4/5 rounded bg-slate-200' />
              </div>
              <div className='h-96 rounded-lg bg-slate-200' />
            </div>
          </div>
        </div>
      </div>
    )
  }
)

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params

  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <div className='bg-white'>
      <LandingWelcome lang={lang} dict={dict.LandingPage.Welcome} />
      <LandingUpdates testimonialsDict={dict.LandingPage.Testimonials} />
      <LandingLocation
        dict={dict.LandingPage.Location}
        registrationFormDict={dict.RegistrationPage.Form}
      />
    </div>
  )
}
