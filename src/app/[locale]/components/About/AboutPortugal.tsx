'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState, useCallback } from 'react'
import { useIntersectionObserver } from '@/src/hooks/useIntersectionObserver'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import clsx from 'clsx'
import { GLOBAL_ASSETS, WAVE_HEIGHT } from '@/src/lib/constants'

export default function AboutPortugal() {
  const t = useTranslations('AboutPage.Portugal')
  const { ref: sectionRef, isVisible } = useIntersectionObserver<HTMLElement>()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  // ===== Constants =====
  const ASSETS = {
    background: '/img/about/portugal-bg.webp',
    logo: GLOBAL_ASSETS.logo,
    wave: GLOBAL_ASSETS.wave
  } as const

  const SPOTS = [
    {
      key: 'portugal',
      img: '/img/about/portugal.webp',
      alt: t('cards.portugal.alt')
    },
    {
      key: 'cabo',
      img: '/img/about/cabo-da-roca.webp',
      alt: t('cards.cabo.alt')
    },
    {
      key: 'boca',
      img: '/img/about/boca-do-inferno.webp',
      alt: t('cards.boca.alt')
    },
    {
      key: 'sec1719',
      img: '/img/about/sec-xvii-xix.webp',
      alt: t('cards.sec1719.alt')
    }
  ] as const

  // Slider setup - only for mobile/tablet
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    defaultAnimation: { duration: 600 },
    slides: {
      perView: 1.2,
      spacing: 16
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 2.2, spacing: 20 }
      },
      '(min-width: 1024px)': {
        disabled: true // Disable slider on desktop
      }
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel)
    }
  })

  // Navigation functions
  const goToSlide = useCallback(
    (index: number) => {
      instanceRef.current?.moveToIdx(index)
    },
    [instanceRef]
  )

  const goToPrevious = useCallback(() => {
    instanceRef.current?.prev()
  }, [instanceRef])

  const goToNext = useCallback(() => {
    instanceRef.current?.next()
  }, [instanceRef])

  return (
    <section
      ref={sectionRef}
      className='relative w-full overflow-hidden'
      style={{ paddingBottom: `${WAVE_HEIGHT}px` }}
      aria-labelledby='portugal-title'
    >
      {/* Background with loading state */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100' />
        <Image
          src={ASSETS.background}
          alt=''
          role='presentation'
          fill
          className={clsx(
            'object-cover motion-safe:transition-opacity duration-700',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          sizes='100vw'
          loading='eager'
          quality={75}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Content */}
      <div className='mx-auto max-w-screen-xl px-4 py-10 sm:py-12'>
        {/* Title + intro + logo */}
        <div className='relative grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_0.9fr]'>
          {/* LEFT - Content */}
          <div
            className={clsx(
              'space-y-6 motion-safe:transition-all duration-1000 ease-out',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
          >
            <h2
              id='portugal-title'
              className='text-2xl font-extrabold uppercase text-sky-500 sm:text-3xl md:text-4xl'
            >
              {t('title')}
            </h2>

            <div className='space-y-4 text-slate-700'>
              {(['p1', 'p2', 'p3', 'p4'] as const).map((key, index) => (
                <p
                  key={key}
                  className={clsx(
                    'leading-relaxed motion-safe:transition-all duration-700 ease-out',
                    isVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  )}
                  style={{
                    transitionDelay: `${(index + 1) * 150}ms`
                  }}
                >
                  {t(key)}
                </p>
              ))}
            </div>
          </div>

          {/* RIGHT - Logo only (desktop only) */}
          <div
            className={clsx(
              'relative hidden items-start justify-end motion-safe:transition-all duration-1000 ease-out md:flex',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
            style={{ transitionDelay: '600ms' }}
          >
            <div className='flex flex-col items-end'>
              <Image
                src={ASSETS.logo}
                alt={t('logoAlt')}
                width={260}
                height={180}
                quality={80}
                loading='lazy'
                className='h-auto w-[220px] object-contain motion-safe:transition-transform duration-300 hover:scale-105 lg:w-[260px]'
                sizes='(max-width: 1024px) 220px, 260px'
              />
            </div>
          </div>
        </div>

        {/* Cards - Desktop Grid */}
        <div
          className={clsx(
            'mt-10 hidden grid-cols-4 gap-6 motion-safe:transition-all duration-1000 ease-out lg:grid',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
          style={{ transitionDelay: '800ms' }}
        >
          {SPOTS.map((spot, index) => (
            <SpotCard
              key={spot.key}
              spot={spot}
              index={index}
              t={t}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Cards - Mobile/Tablet Slider */}
        <div
          className={clsx(
            'mt-10 motion-safe:transition-all duration-1000 ease-out lg:hidden',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
          style={{ transitionDelay: '800ms' }}
        >
          {/* Slider */}
          <div className='relative'>
            <div
              ref={sliderRef}
              className='keen-slider'
              aria-labelledby='portugal-title'
            >
              {SPOTS.map((spot, index) => (
                <div key={spot.key} className='keen-slider__slide px-2'>
                  <SpotCard
                    spot={spot}
                    index={index}
                    t={t}
                    isVisible={isVisible}
                  />
                </div>
              ))}
            </div>

            {/* Navigation controls */}
            <div className='mt-4 flex items-center justify-center gap-4'>
              {/* Navigation arrows */}
              <button
                onClick={goToPrevious}
                aria-label='Previous card'
                className='rounded-full bg-sky-500/20 p-2 backdrop-blur-sm motion-safe:transition-all hover:bg-sky-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50'
              >
                <FiChevronLeft className='h-4 w-4 text-sky-500' />
              </button>

              {/* Dots */}
              <div className='flex gap-2'>
                {SPOTS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to card ${index + 1}`}
                    className={clsx(
                      'h-2 w-2 rounded-full motion-safe:transition-all',
                      currentSlide === index
                        ? 'scale-125 bg-sky-500'
                        : 'bg-sky-500/50 hover:bg-sky-500/80'
                    )}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                aria-label='Next card'
                className='rounded-full bg-sky-500/20 p-2 backdrop-blur-sm motion-safe:transition-all hover:bg-sky-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50'
              >
                <FiChevronRight className='h-4 w-4 text-sky-500' />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave without stats */}
      <div className='absolute bottom-0 left-1/2 w-screen -translate-x-1/2'>
        <div className='relative' style={{ height: `${WAVE_HEIGHT}px` }}>
          <Image
            src={ASSETS.wave}
            alt=''
            role='presentation'
            fill
            className='-mb-px object-cover'
            sizes='100vw'
            loading='lazy'
            unoptimized
          />
        </div>
      </div>
    </section>
  )
}

/* --- Enhanced Spot Card Component --- */
interface SpotCardProps {
  spot: {
    key: string
    img: string
    alt: string
  }
  index: number
  t: (key: string) => string
  isVisible: boolean
}

function SpotCard({ spot, index, t, isVisible }: SpotCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <article
      className={clsx(
        'group flex h-full flex-col motion-safe:transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      )}
      style={{
        transitionDelay: `${800 + index * 100}ms`
      }}
    >
      {/* Content - Title, Subtitle, Text */}
      <div className='mb-4 flex-1'>
        <h3 className='mb-3 text-lg font-extrabold uppercase text-sky-500 sm:text-xl'>
          {t(`cards.${spot.key}.title`)}{' '}
          <span className='font-normal text-sky-500'>
            {t(`cards.${spot.key}.subtitle`)}
          </span>
        </h3>

        <p className='text-sm leading-relaxed text-slate-700 sm:text-base'>
          {t(`cards.${spot.key}.desc`)}
        </p>
      </div>

      {/* Image at bottom */}
      <div className='relative h-40 w-full overflow-hidden rounded-lg sm:h-48'>
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className='absolute inset-0 motion-safe:animate-pulse rounded-lg bg-slate-200' />
        )}

        <Image
          src={spot.img}
          alt={spot.alt}
          fill
          className={clsx(
            'rounded-lg object-cover motion-safe:transition-all duration-300 group-hover:scale-105',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
          loading='eager'
          decoding='async'
          quality={80}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
    </article>
  )
}
