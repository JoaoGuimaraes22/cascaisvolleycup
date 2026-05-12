'use client'

import { useState } from 'react'
import NewsCard from '../landing/news-card'
import type { NewsCardData } from '../../_lib/news'
import { urlFor } from '../../_lib/sanity-image'
import { localeHref } from '../../_lib/seo'
import { formatNewsDate } from '../../_lib/format-date'
import { NEWS_IMAGE } from '../../_lib/constants'
import type { Locale } from '@/i18n-config'

const INITIAL_LIMIT = 8

type Props = {
  lang: Locale
  posts: NewsCardData[]
  dict: { seeMore: string }
}

export default function NewsList({ lang, posts, dict }: Props) {
  const [showAll, setShowAll] = useState(false)
  const visiblePosts = showAll ? posts : posts.slice(0, INITIAL_LIMIT)
  const hasMore = posts.length > INITIAL_LIMIT && !showAll

  return (
    <section className='mx-auto max-w-screen-xl px-4 pb-20'>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {visiblePosts.map((post, i) => (
          <NewsCard
            key={post._id}
            title={post.title}
            date={formatNewsDate(post.publishedAt, lang)}
            excerpt={post.description}
            image={urlFor(post.image)
              .width(NEWS_IMAGE.card.width)
              .height(NEWS_IMAGE.card.height)
              .fit('crop')
              .url()}
            link={localeHref(lang, `/news/${post.slug}`)}
            priority={i === 0}
          />
        ))}
      </div>

      {hasMore && (
        <div className='mt-10 flex justify-center'>
          <button
            type='button'
            onClick={() => setShowAll(true)}
            className='rounded-full bg-sky-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:scale-105 hover:bg-sky-800 hover:shadow-md focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:outline-none motion-safe:transition-all'
          >
            {dict.seeMore}
          </button>
        </div>
      )}
    </section>
  )
}
