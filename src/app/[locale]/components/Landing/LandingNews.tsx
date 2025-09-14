// 2. News Section Component
// src/app/[locale]/components/Landing/LandingNews.tsx

'use client'

import { useCallback, useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { useTranslations } from 'next-intl'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import NewsCard from './NewsCard'
import clsx from 'clsx'

// News-specific assets and constants
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
  },
  animations: {
    duration: 600
  },
  breakpoints: {
    mobile: '(min-width: 768px)',
    desktop: '(min-width: 1024px)'
  },
  spacing: {
    mobile: 16,
    tablet: 20,
    desktop: 24
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

interface LandingNewsProps {
  isVisible: boolean
}

export default function LandingNews({ isVisible }: LandingNewsProps) {
  const t = useTranslations('LandingPage.Updates')
  const [currentNewsSlide, setCurrentNewsSlide] = useState(0)

  // News slider
  const [newsSliderRef, newsInstanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    defaultAnimation: { duration: NEWS_ASSETS.animations.duration },
    slides: {
      perView: 1,
      spacing: NEWS_ASSETS.spacing.mobile
    },
    breakpoints: {
      [NEWS_ASSETS.breakpoints.mobile]: {
        slides: { perView: 2, spacing: NEWS_ASSETS.spacing.tablet }
      },
      [NEWS_ASSETS.breakpoints.desktop]: {
        slides: { perView: 4, spacing: NEWS_ASSETS.spacing.desktop }
      }
    },
    slideChanged(s) {
      setCurrentNewsSlide(s.track.details.rel)
    }
  })

  // Navigation functions
  const goToNewsSlide = useCallback(
    (index: number) => {
      newsInstanceRef.current?.moveToIdx(index)
    },
    [newsInstanceRef]
  )

  const goToNewsPrevious = useCallback(() => {
    newsInstanceRef.current?.prev()
  }, [newsInstanceRef])

  const goToNewsNext = useCallback(() => {
    newsInstanceRef.current?.next()
  }, [newsInstanceRef])

  return (
    <div className='mx-auto max-w-screen-xl px-4'>
      <div
        className={clsx(
          'transition-all duration-1000 ease-out',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        )}
      >
        <h2
          id='news-heading'
          className='mb-6 text-2xl font-extrabold uppercase tracking-wide text-sky-500 sm:text-3xl'
        >
          {t('Latest_news') || 'LATEST NEWS'}
        </h2>

        {/* News Slider */}
        <div className='relative'>
          <div
            ref={newsSliderRef}
            className='keen-slider'
            aria-labelledby='news-heading'
          >
            {newsItems.map((item, index) => (
              <div key={index} className='keen-slider__slide px-2'>
                <NewsCard {...item} priority={index === 0} />
              </div>
            ))}
          </div>

          {/* News slider controls */}
          <div className='mt-4 flex items-center justify-center gap-4'>
            {/* Navigation arrows */}
            <button
              onClick={goToNewsPrevious}
              aria-label='Previous news'
              className='rounded-full bg-sky-500/20 p-2 backdrop-blur-sm transition-all hover:bg-sky-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50'
            >
              <FiChevronLeft className='h-4 w-4 text-sky-500' />
            </button>

            {/* Dots */}
            <div className='flex gap-2'>
              {newsItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToNewsSlide(index)}
                  aria-label={`Go to news item ${index + 1}`}
                  className={clsx(
                    'h-2 w-2 rounded-full transition-all',
                    currentNewsSlide === index
                      ? 'scale-125 bg-sky-500'
                      : 'bg-sky-500/50 hover:bg-sky-500/80'
                  )}
                />
              ))}
            </div>

            <button
              onClick={goToNewsNext}
              aria-label='Next news'
              className='rounded-full bg-sky-500/20 p-2 backdrop-blur-sm transition-all hover:bg-sky-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50'
            >
              <FiChevronRight className='h-4 w-4 text-sky-500' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
