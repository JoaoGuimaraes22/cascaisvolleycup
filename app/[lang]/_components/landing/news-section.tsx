import type { ComponentProps } from 'react'
import LandingNews, { type LandingNewsItem } from './news'
import SectionWave from '../global/section-wave'
import { getRecentPosts } from '../../_lib/news'
import { urlFor } from '../../_lib/sanity-image'
import { formatNewsDate } from '../../_lib/format-date'
import { localeHref } from '../../_lib/seo'
import { WAVE_HEIGHT, NEWS_IMAGE } from '../../_lib/constants'
import type { Locale } from '@/i18n-config'

type Props = {
  lang: Locale
  dict: ComponentProps<typeof LandingNews>['dict']
}

/**
 * Async server component holding the home page's only network dependency (Sanity
 * news). Isolated behind its own <Suspense> in page.tsx so the fetch never gates
 * the above-the-fold content — only this below-the-fold strip streams in.
 */
export default async function NewsSection({ lang, dict }: Props) {
  const recentPosts = await getRecentPosts(lang, 4)

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

  if (newsItems.length === 0) return null

  return (
    <section
      className='relative isolate overflow-hidden bg-white py-12 sm:py-16 lg:py-20'
      style={{ paddingBottom: `${WAVE_HEIGHT}px` }}
    >
      <LandingNews items={newsItems} dict={dict} />
      <SectionWave />
    </section>
  )
}
