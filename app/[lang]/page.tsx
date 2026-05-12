import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, hasLocale } from './dictionaries'
import LandingWelcome from './_components/landing/welcome'
import LandingUpdates from './_components/landing/updates'
import LandingLocation from './_components/landing/location'
import LandingNews, { type LandingNewsItem } from './_components/landing/news'
import SectionWave from './_components/global/section-wave'
import { buildPageMetadata, localeHref } from './_lib/seo'
import { getRecentPosts } from './_lib/news'
import { urlFor } from './_lib/sanity-image'
import { formatNewsDate } from './_lib/format-date'
import { WAVE_HEIGHT, NEWS_IMAGE } from './_lib/constants'

export const revalidate = 86400

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

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params

  if (!hasLocale(lang)) notFound()

  const [dict, recentPosts] = await Promise.all([
    getDictionary(lang),
    getRecentPosts(lang, 4)
  ])

  const newsItems: LandingNewsItem[] = recentPosts.map(post => ({
    title: post.title,
    date: formatNewsDate(post.publishedAt, lang),
    excerpt: post.description,
    image: urlFor(post.image)
      .width(NEWS_IMAGE.card.width)
      .height(NEWS_IMAGE.card.height)
      .fit('crop')
      .url(),
    link: localeHref(lang, `/news/${post.slug}`)
  }))

  return (
    <div className='bg-white'>
      <LandingWelcome lang={lang} dict={dict.LandingPage.Welcome} />
      <LandingUpdates testimonialsDict={dict.LandingPage.Testimonials} />
      <LandingLocation
        dict={dict.LandingPage.Location}
        registrationFormDict={dict.RegistrationPage.Form}
      />
      {newsItems.length > 0 && (
        <section
          className='relative isolate overflow-hidden bg-white py-12 sm:py-16 lg:py-20'
          style={{ paddingBottom: `${WAVE_HEIGHT}px` }}
        >
          <LandingNews items={newsItems} dict={dict.LandingPage.Updates} />
          <SectionWave />
        </section>
      )}
    </div>
  )
}
