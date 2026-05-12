'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useIntersectionObserver } from '../../_hooks/use-intersection-observer'
import { useSnapCarousel } from '../../_hooks/use-snap-carousel'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import clsx from 'clsx'
import { GLOBAL_ASSETS, WAVE_HEIGHT } from '../../_lib/constants'

type CardEntry = {
  title: string
  subtitle: string
  desc: string
  alt: string
}

type AboutPortugalDict = {
  title: string
  p1: string
  p2: string
  p3: string
  p4: string
  logoAlt: string
  taglineAlt: string
  cards: {
    portugal: CardEntry
    cabo: CardEntry
    boca: CardEntry
    sec1719: CardEntry
  }
  stats: {
    teams: string
    athletes: string
    countries: string
    matches: string
  }
}

type Props = {
  dict: AboutPortugalDict
}

type SpotKey = 'portugal' | 'cabo' | 'boca' | 'sec1719'

export default function AboutPortugal({ dict }: Props) {
  const { ref: sectionRef, isVisible } = useIntersectionObserver<HTMLElement>()
  const [imageLoaded, setImageLoaded] = useState(false)

  const ASSETS = {
    background: '/img/about/portugal-bg.webp',
    logo: GLOBAL_ASSETS.logo,
    wave: GLOBAL_ASSETS.wave
  } as const

  const SPOTS: ReadonlyArray<{ key: SpotKey; img: string; alt: string }> = [
    {
      key: 'portugal',
      img: '/img/about/portugal.webp',
      alt: dict.cards.portugal.alt
    },
    {
      key: 'cabo',
      img: '/img/about/cabo-da-roca.webp',
      alt: dict.cards.cabo.alt
    },
    {
      key: 'boca',
      img: '/img/about/boca-do-inferno.webp',
      alt: dict.cards.boca.alt
    },
    {
      key: 'sec1719',
      img: '/img/about/sec-xvii-xix.webp',
      alt: dict.cards.sec1719.alt
    }
  ] as const

  const { scrollRef, activePage, pageCount, goToPage, next, prev } =
    useSnapCarousel()

  const PARAGRAPHS: Array<'p1' | 'p2' | 'p3' | 'p4'> = ['p1', 'p2', 'p3', 'p4']

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
            'object-cover duration-700 motion-safe:transition-opacity',
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
              'space-y-6 duration-1000 ease-out motion-safe:transition-all',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
          >
            <h2
              id='portugal-title'
              className='text-2xl font-extrabold text-sky-500 uppercase sm:text-3xl md:text-4xl'
            >
              {dict.title}
            </h2>

            <div className='space-y-4 text-slate-700'>
              {PARAGRAPHS.map((key, index) => (
                <p
                  key={key}
                  className={clsx(
                    'leading-relaxed duration-700 ease-out motion-safe:transition-all',
                    isVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  )}
                  style={{
                    transitionDelay: `${(index + 1) * 150}ms`
                  }}
                >
                  {dict[key]}
                </p>
              ))}
            </div>
          </div>

          {/* RIGHT - Logo only (desktop only) */}
          <div
            className={clsx(
              'relative hidden items-start justify-end duration-1000 ease-out motion-safe:transition-all md:flex',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
            style={{ transitionDelay: '600ms' }}
          >
            <div className='flex flex-col items-end'>
              <Image
                src={ASSETS.logo}
                alt={dict.logoAlt}
                width={260}
                height={180}
                quality={80}
                loading='lazy'
                className='h-auto w-[220px] object-contain duration-300 hover:scale-105 motion-safe:transition-transform lg:w-[260px]'
                sizes='(max-width: 1024px) 220px, 260px'
              />
            </div>
          </div>
        </div>

        {/* Cards - Desktop Grid */}
        <div
          className={clsx(
            'mt-10 hidden grid-cols-4 gap-6 duration-1000 ease-out motion-safe:transition-all lg:grid',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
          style={{ transitionDelay: '800ms' }}
        >
          {SPOTS.map((spot, index) => (
            <SpotCard
              key={spot.key}
              spot={spot}
              index={index}
              card={dict.cards[spot.key]}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Cards - Mobile/Tablet Slider */}
        <div
          className={clsx(
            'mt-10 duration-1000 ease-out motion-safe:transition-all lg:hidden',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
          style={{ transitionDelay: '800ms' }}
        >
          <div className='relative'>
            <div
              ref={scrollRef}
              className='scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:gap-5'
              aria-labelledby='portugal-title'
            >
              {SPOTS.map((spot, index) => (
                <div
                  key={spot.key}
                  className='shrink-0 basis-[83%] snap-start px-1 sm:basis-[calc(45%-0.625rem)]'
                >
                  <SpotCard
                    spot={spot}
                    index={index}
                    card={dict.cards[spot.key]}
                    isVisible={isVisible}
                  />
                </div>
              ))}
            </div>

            <div className='mt-4 flex items-center justify-center gap-4'>
              <button
                onClick={prev}
                aria-label='Previous card'
                className='rounded-full bg-sky-500/20 p-2 backdrop-blur-sm hover:bg-sky-500/30 focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:outline-none motion-safe:transition-all'
              >
                <FiChevronLeft className='h-4 w-4 text-sky-500' />
              </button>

              <div className='flex gap-2'>
                {Array.from({ length: pageCount }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    aria-label={`Go to page ${index + 1}`}
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
                aria-label='Next card'
                className='rounded-full bg-sky-500/20 p-2 backdrop-blur-sm hover:bg-sky-500/30 focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:outline-none motion-safe:transition-all'
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
    key: SpotKey
    img: string
    alt: string
  }
  index: number
  card: CardEntry
  isVisible: boolean
}

function SpotCard({ spot, index, card, isVisible }: SpotCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <article
      className={clsx(
        'group flex h-full flex-col duration-700 ease-out motion-safe:transition-all',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      )}
      style={{
        transitionDelay: `${800 + index * 100}ms`
      }}
    >
      {/* Content - Title, Subtitle, Text */}
      <div className='mb-4 flex-1'>
        <h3 className='mb-3 text-lg font-extrabold text-sky-500 uppercase sm:text-xl'>
          {card.title}{' '}
          <span className='font-normal text-sky-500'>{card.subtitle}</span>
        </h3>

        <p className='text-sm leading-relaxed text-slate-700 sm:text-base'>
          {card.desc}
        </p>
      </div>

      {/* Image at bottom */}
      <div className='relative h-40 w-full overflow-hidden rounded-lg sm:h-48'>
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className='absolute inset-0 rounded-lg bg-slate-200 motion-safe:animate-pulse' />
        )}

        <Image
          src={spot.img}
          alt={spot.alt}
          fill
          className={clsx(
            'rounded-lg object-cover duration-300 group-hover:scale-105 motion-safe:transition-all',
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
