'use client'

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import NewsCard from './news-card'
import clsx from 'clsx'
import { useSnapCarousel } from '../../_hooks/use-snap-carousel'

const NEWS_ASSETS = {
  images: {
    news1: '/img/news/news1.webp',
    news2: '/img/news/news2.webp',
    news3: '/img/news/news3.webp',
    news4: '/img/news/news4.webp'
  },
  links: {
    cornacchia2025: '/news/cornacchia-2025',
    nationsCup9: '/news/nations-cup-9',
    streamingScamWarning: '/news/streaming-scam-warning',
    mvpAwards: '/news/mvp-awards'
  }
} as const

interface NewsItem {
  title: string
  date: string
  excerpt: string
  image: string
  link: string
}

const newsItems: NewsItem[] = [
  {
    title: 'Ranking Cascais Volley Cup 2025',
    date: 'April 23, 2025',
    excerpt:
      'Ranking and Pictures of Cascais Volley Cup 2025, the volleyball tournament of Cascais',
    image: NEWS_ASSETS.images.news1,
    link: NEWS_ASSETS.links.cornacchia2025
  },
  {
    title: 'Under 21 – Rankings & Pictures',
    date: 'March 6, 2025',
    excerpt:
      'Check out pictures, video and rankings of the Under 21 tournament.',
    image: NEWS_ASSETS.images.news2,
    link: NEWS_ASSETS.links.nationsCup9
  },
  {
    title: 'New Arrivals: Pelamora SC',
    date: 'February 20, 2025',
    excerpt: 'Official Statement: Pelamora is coming with Under-15, 17 and 21',
    image: NEWS_ASSETS.images.news3,
    link: NEWS_ASSETS.links.streamingScamWarning
  },
  {
    title: 'MVP Awards',
    date: 'February 10, 2025',
    excerpt: 'MVP awards given to the athletes who stood out during the event.',
    image: NEWS_ASSETS.images.news4,
    link: NEWS_ASSETS.links.mvpAwards
  }
]

type LandingNewsDict = {
  Latest_news: string
}

interface LandingNewsProps {
  isVisible: boolean
  dict: LandingNewsDict
}

export default function LandingNews({ isVisible, dict }: LandingNewsProps) {
  const { scrollRef, activePage, pageCount, goToPage, next, prev } =
    useSnapCarousel({ loop: true })

  return (
    <div className='mx-auto max-w-screen-xl px-4'>
      <div
        className={clsx(
          'duration-1000 ease-out motion-safe:transition-all',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        )}
      >
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
            {newsItems.map((item, index) => (
              <div
                key={index}
                className='shrink-0 snap-start basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(25%-0.75rem)]'
              >
                <NewsCard {...item} priority={index === 0} />
              </div>
            ))}
          </div>

          <div className='mt-4 flex items-center justify-center gap-4'>
            <button
              onClick={prev}
              aria-label='Previous news'
              className='rounded-full bg-sky-500/20 p-2 backdrop-blur-sm hover:bg-sky-500/30 focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:outline-none motion-safe:transition-all'
            >
              <FiChevronLeft className='h-4 w-4 text-sky-500' />
            </button>

            <div className='flex gap-2'>
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  aria-label={`Go to news page ${index + 1}`}
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
              aria-label='Next news'
              className='rounded-full bg-sky-500/20 p-2 backdrop-blur-sm hover:bg-sky-500/30 focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:outline-none motion-safe:transition-all'
            >
              <FiChevronRight className='h-4 w-4 text-sky-500' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
