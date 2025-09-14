'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FiMapPin } from 'react-icons/fi'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import RegistrationToast from './RegistrationToast'

interface StatsListProps {
  items: string[]
  compact?: boolean
}

export default function LandingLocation() {
  const t = useTranslations('LandingPage.Location')
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showRegistrationToast, setShowRegistrationToast] = useState(false)

  // Constants for better maintainability
  const ASSETS = {
    background: '/img/landing/home-page-2-2.webp',
    map: '/img/landing/mapa.webp',
    tagline: '/img/global/tagline.webp',
    wave: '/img/global/ondas-3.webp'
  } as const

  const WAVE_HEIGHT = 135
  const STATS_DATA = [
    t('stats_teams'),
    t('stats_athletes'),
    t('stats_countries'),
    t('stats_games')
  ]

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2, rootMargin: '50px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handlePlanTripClick = () => {
    setShowRegistrationToast(true)
  }

  return (
    <section
      ref={sectionRef}
      className='relative isolate min-h-[720px] overflow-hidden sm:min-h-[800px] lg:min-h-[880px]'
      style={{ paddingBottom: `${WAVE_HEIGHT}px` }}
      aria-labelledby='location-title'
    >
      {/* Background with optimized loading */}
      <div className='absolute inset-0 -z-10'>
        <Image
          src={ASSETS.background}
          alt=''
          fill
          loading='eager'
          sizes='100vw'
          className='object-cover object-[50%_80%] md:object-[50%_78%] lg:object-[50%_76%]'
          quality={80}
        />
      </div>

      {/* Content container - Mobile: center everything, Desktop: grid layout */}
      <div className='mx-auto max-w-screen-xl px-4 pb-10 pt-[clamp(32px,4vw,64px)] sm:pb-12 lg:grid lg:h-full lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-8'>
        {/* Mobile Layout: Centered vertical stack */}
        <div className='flex flex-col items-center space-y-6 lg:hidden'>
          {/* Text Content */}
          <div
            className={clsx(
              'w-full max-w-md transition-all duration-1000 ease-out',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
          >
            <h1
              id='location-title'
              className='mb-4 text-left text-2xl font-extrabold uppercase tracking-wide text-sky-500 sm:text-3xl'
            >
              {t('title')}
            </h1>

            <div className='mb-6 space-y-4 text-left'>
              <p className='text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                {t('p1')}
              </p>
              <p className='text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                {t('p2_prefix')}
                <span className='font-extrabold text-sky-600'>
                  {t('flixbus')}
                </span>
                {t('p2_suffix')}
              </p>
            </div>
          </div>

          {/* Map */}
          <div
            className={clsx(
              'w-full max-w-lg transition-all delay-300 duration-1000 ease-out',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
          >
            <div className='group rounded-lg bg-gradient-to-br from-sky-600 to-sky-700 p-[3px] shadow-xl ring-1 ring-black/5'>
              <div className='overflow-hidden rounded-md bg-white transition-transform duration-300 group-hover:scale-[1.02]'>
                <Image
                  src={ASSETS.map}
                  alt={
                    t('mapAlt') || 'Map showing route from Lisbon to Cascais'
                  }
                  width={768}
                  height={456}
                  className='h-auto w-full object-cover'
                  loading='eager'
                  sizes='(max-width: 768px) 90vw, 512px'
                  quality={80}
                />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div
            className={clsx(
              'transition-all delay-500 duration-700 ease-out',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
          >
            <button
              type='button'
              onClick={handlePlanTripClick}
              className='group relative overflow-hidden rounded-full bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-3 text-sm font-bold text-white shadow-xl ring-1 ring-black/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:text-base'
            >
              <span className='relative z-10 flex items-center gap-2'>
                <FiMapPin className='h-4 w-4' />
                {t('cta')}
              </span>
              <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full' />
            </button>
          </div>

          {/* Tagline */}
          <div
            className={clsx(
              'w-[260px] transition-all delay-700 duration-1000 ease-out sm:w-[320px]',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
          >
            <Image
              src={ASSETS.tagline}
              alt={t('taglineAlt') || 'Feel the action, enjoy the summer'}
              width={1000}
              height={215}
              className='h-auto w-full object-contain drop-shadow-lg'
              sizes='(max-width: 640px) 260px, 320px'
              quality={80}
              loading='lazy'
            />
          </div>
        </div>

        {/* Desktop Layout: Grid positioning */}
        <div className='hidden lg:contents'>
          {/* Top Left: Text Content */}
          <div
            className={clsx(
              'flex flex-col transition-all duration-1000 ease-out',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
          >
            <h1
              id='location-title'
              className='mb-4 text-3xl font-extrabold uppercase tracking-wide text-sky-500 lg:text-[32px]'
            >
              {t('title')}
            </h1>

            <div className='space-y-4'>
              <p className='max-w-prose text-base leading-relaxed text-slate-800/90'>
                {t('p1')}
              </p>
              <p className='max-w-prose text-base leading-relaxed text-slate-800/90'>
                {t('p2_prefix')}
                <span className='font-extrabold text-sky-600'>
                  {t('flixbus')}
                </span>
                {t('p2_suffix')}
              </p>
            </div>
          </div>

          {/* Top Right: Tagline */}
          <div
            className={clsx(
              'flex items-start justify-end transition-all delay-300 duration-1000 ease-out',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
          >
            <div className='w-[380px] xl:w-[420px]'>
              <Image
                src={ASSETS.tagline}
                alt={t('taglineAlt') || 'Feel the action, enjoy the summer'}
                width={1000}
                height={215}
                className='h-auto w-full object-contain drop-shadow-lg'
                sizes='420px'
                quality={80}
                loading='lazy'
              />
            </div>
          </div>

          {/* Bottom Left: Map */}
          <div
            className={clsx(
              'flex items-start justify-start transition-all delay-500 duration-1000 ease-out',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
          >
            <div className='group max-w-[540px] rounded-lg bg-gradient-to-br from-sky-600 to-sky-700 p-[3px] shadow-xl ring-1 ring-black/5'>
              <div className='overflow-hidden rounded-md bg-white transition-transform duration-300 group-hover:scale-[1.02]'>
                <Image
                  src={ASSETS.map}
                  alt={
                    t('mapAlt') || 'Map showing route from Lisbon to Cascais'
                  }
                  width={768}
                  height={456}
                  className='h-auto w-full object-cover'
                  loading='eager'
                  sizes='540px'
                  quality={80}
                />
              </div>
            </div>
          </div>

          {/* Bottom Right: CTA Button */}
          <div
            className={clsx(
              'flex items-end justify-end transition-all delay-700 duration-700 ease-out',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
          >
            <button
              type='button'
              onClick={handlePlanTripClick}
              className='group relative overflow-hidden rounded-full bg-gradient-to-r from-sky-600 to-sky-700 px-8 py-4 text-base font-bold text-white shadow-xl ring-1 ring-black/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 lg:text-lg'
            >
              <span className='relative z-10 flex items-center gap-2'>
                <FiMapPin className='h-5 w-5' />
                {t('cta')}
              </span>
              <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full' />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Wave Section */}
      <div className='absolute bottom-0 left-1/2 w-screen -translate-x-1/2'>
        <Image
          src={ASSETS.wave}
          alt=''
          width={1920}
          height={WAVE_HEIGHT}
          className='-mb-px block w-full object-cover'
          style={{ height: `${WAVE_HEIGHT}px` }}
          loading='lazy'
          quality={75}
        />

        {/* Stats Overlay */}
        <div className='pointer-events-none absolute inset-0'>
          <div className='mx-auto flex h-full max-w-screen-xl items-center justify-center px-4 lg:justify-start'>
            <div
              className={clsx(
                'transition-all delay-1000 duration-1000 ease-out',
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              )}
            >
              {/* Mobile: compact version */}
              <div className='block lg:hidden'>
                <StatsList compact items={STATS_DATA} />
              </div>
              {/* Desktop: full version */}
              <div className='hidden lg:block'>
                <StatsList items={STATS_DATA} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Toast Modal */}
      <RegistrationToast
        isOpen={showRegistrationToast}
        onClose={() => setShowRegistrationToast(false)}
      />
    </section>
  )
}

function StatsList({ items, compact = false }: StatsListProps) {
  return (
    <ul
      role='list'
      aria-label='Tournament statistics'
      className={clsx(
        'flex items-center whitespace-nowrap font-extrabold uppercase text-white drop-shadow-lg',
        compact
          ? 'gap-2 px-2 text-[10px] tracking-tight'
          : 'gap-3 px-3 text-[11px] tracking-normal sm:gap-4 sm:text-[13px] sm:tracking-wide lg:gap-6 lg:text-lg'
      )}
    >
      {items.map((item, index) => (
        <li
          key={`stat-${index}`}
          className={clsx(
            'flex items-center transition-all duration-300 hover:scale-105',
            compact ? 'gap-2' : 'gap-3 sm:gap-4 lg:gap-6'
          )}
        >
          <span className='relative'>
            {item}
            <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100' />
          </span>
          {index < items.length - 1 && (
            <span
              className={clsx(
                'leading-none text-sky-300',
                compact ? 'text-xs' : 'text-sm sm:text-lg lg:text-2xl'
              )}
              aria-hidden
            >
              •
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
