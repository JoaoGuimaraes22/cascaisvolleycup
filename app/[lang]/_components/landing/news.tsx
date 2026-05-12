'use client'

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import NewsCard from './news-card'
import clsx from 'clsx'
import { useSnapCarousel } from '../../_hooks/use-snap-carousel'

export type LandingNewsItem = {
  title: string
  date: string
  excerpt: string
  image: string
  link: string
}

type LandingNewsDict = {
  Latest_news: string
  previousNews: string
  nextNews: string
  goToNewsPage: string
}

type Props = {
  items: LandingNewsItem[]
  dict: LandingNewsDict
}

export default function LandingNews({ items, dict }: Props) {
  const { scrollRef, activePage, pageCount, goToPage, next, prev } =
    useSnapCarousel({ loop: true })

  if (items.length === 0) return null

  return (
    <div className='mx-auto max-w-screen-xl px-4'>
      <h2
        id='news-heading'
        className='mb-6 text-2xl font-extrabold tracking-wide text-sky-500 uppercase sm:text-3xl'
      >
        {dict.Latest_news}
      </h2>

      <div className='relative'>
        <div
          ref={scrollRef}
          className='scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2'
          aria-labelledby='news-heading'
        >
          {items.map((item, index) => (
            <div
              key={item.link}
              className='shrink-0 basis-full snap-start sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(25%-0.75rem)]'
            >
              <NewsCard {...item} priority={index === 0} />
            </div>
          ))}
        </div>

        {pageCount > 1 && (
          <div className='mt-4 flex items-center justify-center gap-4'>
            <button
              onClick={prev}
              aria-label={dict.previousNews}
              className='rounded-full bg-sky-500/20 p-2 backdrop-blur-sm hover:bg-sky-500/30 focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:outline-none motion-safe:transition-all'
            >
              <FiChevronLeft className='h-4 w-4 text-sky-500' />
            </button>

            <div className='flex gap-2'>
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  aria-label={`${dict.goToNewsPage} ${index + 1}`}
                  className={clsx(
                    'h-2 w-2 rounded-full motion-safe:transition-all',
                    activePage === index
                      ? 'scale-125 bg-sky-500'
                      : 'bg-sky-500/50 hover:bg-sky-500/80'
                  )}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label={dict.nextNews}
              className='rounded-full bg-sky-500/20 p-2 backdrop-blur-sm hover:bg-sky-500/30 focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:outline-none motion-safe:transition-all'
            >
              <FiChevronRight className='h-4 w-4 text-sky-500' />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
