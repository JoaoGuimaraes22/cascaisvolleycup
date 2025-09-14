'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FaMedal, FaChevronDown, FaTrophy } from 'react-icons/fa'
import { BiAward } from 'react-icons/bi'
import clsx from 'clsx'

type DivisionKey = 'Sub15' | 'Sub17' | 'Open'
const DIVISIONS: DivisionKey[] = ['Sub15', 'Sub17', 'Open']

// Updated winners data with the new structure
const WINNERS: Record<
  string,
  Record<DivisionKey, { name: string; country: string }[]>
> = {
  '2025': {
    Sub15: [
      { name: 'PEL Amora SC A', country: 'PT' },
      { name: 'Cascais Volley4all', country: 'PT' },
      { name: 'PEL Amora SC B', country: 'PT' }
    ],
    Sub17: [
      { name: 'SC Arcozelo', country: 'PT' },
      { name: 'PEL Amora SC', country: 'PT' },
      { name: 'São Francisco AD', country: 'PT' }
    ],
    Open: [
      { name: 'Cascais Volley4all', country: 'PT' },
      { name: 'CV Madrid', country: 'ES' },
      { name: 'AS Mónaco', country: 'MC' }
    ]
  },
  '2024': {
    Sub15: [
      { name: 'SC Arcozelo A', country: 'PT' },
      { name: 'SC Arcozelo B', country: 'PT' },
      { name: 'GDC Gueifães', country: 'PT' }
    ],
    Sub17: [
      { name: 'SC Arcozelo', country: 'PT' },
      { name: 'SC Vila Real', country: 'PT' },
      { name: 'Cascais Volley4all', country: 'PT' }
    ],
    Open: []
  },
  '2023': {
    Sub15: [
      { name: 'CF "Os Belenenses"', country: 'PT' },
      { name: 'CJS Arouca', country: 'PT' },
      { name: 'Cascais Volley4all', country: 'PT' }
    ],
    Sub17: [
      { name: 'Madeira Torres', country: 'PT' },
      { name: 'Cascais Volley4all', country: 'PT' },
      { name: 'Lusófona VC', country: 'PT' }
    ],
    Open: []
  }
}

export default function HallOfFameWinners() {
  const t = useTranslations('HallOfFamePage.Winners')
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Assets with better organization
  const ASSETS = {
    background: '/img/hall-of-fame/hero-bg.webp',
    winnersImg: '/img/program/players.webp',
    tagline: '/img/global/tagline.webp',
    wave: '/img/global/ondas-3.webp'
  } as const

  const WAVE_HEIGHT = 135
  const years = Object.keys(WINNERS).sort((a, b) => Number(b) - Number(a))
  const [openYear, setOpenYear] = useState(years[0])
  const [animatingYear, setAnimatingYear] = useState<string | null>(null)

  // Helper functions for icons and labels
  const getDivisionIcon = (division: DivisionKey) => {
    switch (division) {
      case 'Sub15':
        return <span className='text-[9px] font-bold'>15</span>
      case 'Sub17':
        return <span className='text-[9px] font-bold'>17</span>
      case 'Open':
        return <FaTrophy className='h-2.5 w-2.5' />
    }
  }

  const getDivisionLabel = (division: DivisionKey) => {
    return t(`divisions.${division}`)
  }

  const flagSrc = (code: string) =>
    `/img/hall-of-fame/${code.toLowerCase()}.svg`

  // Toggle year with animation
  const toggleYear = (year: string) => {
    if (animatingYear) return

    if (openYear === year) {
      setAnimatingYear(year)
      setTimeout(() => {
        setOpenYear('')
        setAnimatingYear(null)
      }, 10)
    } else {
      setAnimatingYear(year)
      setOpenYear(year)
      setTimeout(() => {
        setAnimatingYear(null)
      }, 350)
    }
  }

  // Medal component for winners
  const getMedalColor = (position: number) => {
    switch (position) {
      case 0:
        return 'from-yellow-400 to-amber-500 shadow-amber-200'
      case 1:
        return 'from-gray-300 to-gray-400 shadow-gray-200'
      case 2:
        return 'from-orange-400 to-orange-500 shadow-orange-200'
      default:
        return 'from-gray-200 to-gray-300'
    }
  }

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id='hall-of-fame-winners'
      className='relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100'
      aria-labelledby='winners-title'
    >
      {/* Background */}
      <div className='absolute inset-0 -z-20'>
        <Image
          src={ASSETS.background}
          alt=''
          role='presentation'
          fill
          className='object-cover opacity-40'
          quality={75}
        />
      </div>

      {/* Main Content */}
      <div className='relative z-10'>
        {/* Content Container */}
        <div className='mx-auto max-w-screen-xl px-4 pb-4 pt-8 sm:pt-12'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
            {/* Left Column: Winners List */}
            <div className='lg:col-span-7'>
              <header className='mb-8'>
                <h2
                  id='winners-title'
                  className={clsx(
                    'mb-2 text-xl font-extrabold uppercase tracking-wide text-sky-500 transition-all duration-1000 ease-out sm:text-2xl',
                    isVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  )}
                  style={{ transitionDelay: '200ms' }}
                >
                  {t('title')}
                </h2>
              </header>

              {/* Minimalist Winners by Year */}
              <div
                className={clsx(
                  'space-y-3 transition-all duration-1000 ease-out',
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
                )}
                style={{ transitionDelay: '400ms' }}
              >
                <div className='overflow-hidden rounded-xl bg-white/80 shadow-xl ring-1 ring-black/5 backdrop-blur-sm'>
                  <div className='divide-y divide-slate-100'>
                    {years.map((year, yearIndex) => (
                      <div
                        key={year}
                        className={clsx(
                          'transition-all duration-500 ease-out',
                          isVisible
                            ? 'translate-x-0 opacity-100'
                            : '-translate-x-8 opacity-0'
                        )}
                        style={{
                          transitionDelay: `${500 + yearIndex * 100}ms`
                        }}
                      >
                        {/* Year Header - Clickable */}
                        <button
                          type='button'
                          onClick={() => toggleYear(year)}
                          className={clsx(
                            'flex w-full items-center justify-between px-4 py-3 text-left transition-all duration-200',
                            openYear === year
                              ? 'bg-gradient-to-r from-sky-50 to-blue-50'
                              : 'hover:bg-slate-50'
                          )}
                        >
                          <div className='flex items-center gap-3'>
                            <BiAward
                              className={clsx(
                                'h-5 w-5 transition-colors duration-200',
                                openYear === year
                                  ? 'text-sky-600'
                                  : 'text-slate-400'
                              )}
                            />
                            <span className='text-lg font-bold text-slate-800'>
                              {year}
                            </span>
                          </div>
                          <FaChevronDown
                            className={clsx(
                              'h-4 w-4 text-slate-400 transition-transform duration-300',
                              openYear === year ? 'rotate-180' : 'rotate-0'
                            )}
                          />
                        </button>

                        {/* Collapsible Content */}
                        <div
                          className={clsx(
                            'duration-350 grid overflow-hidden transition-all ease-out',
                            openYear === year
                              ? 'grid-rows-[1fr] opacity-100'
                              : 'grid-rows-[0fr] opacity-0'
                          )}
                        >
                          <div className='overflow-hidden'>
                            <div className='px-4 pb-4'>
                              {DIVISIONS.map(divKey => {
                                const divisionWinners = WINNERS[year][divKey]

                                if (
                                  !divisionWinners ||
                                  divisionWinners.length === 0
                                ) {
                                  return null
                                }

                                return (
                                  <div
                                    key={divKey}
                                    className='border-t border-slate-100 py-3 first:border-t-0'
                                  >
                                    {/* Division Header */}
                                    <div className='mb-2 flex items-center gap-2'>
                                      <div className='flex h-5 w-5 items-center justify-center rounded bg-sky-500 text-white'>
                                        {getDivisionIcon(divKey)}
                                      </div>
                                      <h3 className='text-sm font-bold uppercase text-sky-700'>
                                        {getDivisionLabel(divKey)}
                                      </h3>
                                    </div>

                                    {/* Teams List - Stacked for mobile */}
                                    <div className='space-y-2'>
                                      {divisionWinners.map((team, idx) => {
                                        const { name, country } = team
                                        return (
                                          <div
                                            key={`${name}-${idx}`}
                                            className='flex items-center gap-3'
                                          >
                                            {/* Medal */}
                                            <div
                                              className={clsx(
                                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-md',
                                                getMedalColor(idx)
                                              )}
                                            >
                                              {idx === 0 ? (
                                                <FaMedal className='h-3 w-3' />
                                              ) : (
                                                idx + 1
                                              )}
                                            </div>

                                            {/* Team info */}
                                            <div className='flex flex-1 items-center gap-2'>
                                              {/* Flag */}
                                              <div className='relative inline-block h-[16px] w-[24px] shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10'>
                                                <Image
                                                  src={flagSrc(country)}
                                                  alt={`${country} flag`}
                                                  fill
                                                  sizes='24px'
                                                  className='object-cover'
                                                  quality={75}
                                                />
                                              </div>

                                              {/* Team Name */}
                                              <span className='flex-1 text-sm font-medium text-slate-800'>
                                                {name}
                                              </span>
                                            </div>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Content Space Only */}
            <div className='col-span-5'>
              {/* This column is now just for layout spacing */}
            </div>
          </div>
        </div>
      </div>

      {/* Players Image - Positioned Above Wave (Tablet & Desktop Only) with FADE EFFECT */}
      <div className='absolute bottom-[105px] right-4 z-10 hidden sm:block lg:right-[10%]'>
        <div
          className={clsx(
            'relative h-[240px] w-[240px] transition-all delay-700 duration-1000 ease-out lg:h-[520px] lg:w-[520px]',
            // Add the fade mask effect here
            '[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_75%,transparent_100%)]',
            '[mask-image:linear-gradient(to_bottom,black_0%,black_75%,transparent_100%)]',
            isVisible
              ? 'translate-y-0 scale-100 opacity-100'
              : 'translate-y-8 scale-95 opacity-0'
          )}
        >
          {/* Decorative background */}
          <div className='absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-sky-200/30 to-blue-300/20 blur-2xl lg:blur-3xl' />

          <Image
            src={ASSETS.winnersImg}
            alt='Tournament winners celebrating with trophies'
            fill
            sizes='(max-width: 1024px) 240px, 520px'
            className='object-contain object-center drop-shadow-xl transition-transform duration-300 hover:scale-105 lg:drop-shadow-2xl'
            quality={80}
            priority
          />
        </div>
      </div>

      {/* Bottom wave */}
      <div className='pointer-events-none absolute bottom-0 left-1/2 z-0 w-screen -translate-x-1/2'>
        <div className='relative'>
          <Image
            src={ASSETS.wave}
            alt=''
            role='presentation'
            width={2048}
            height={WAVE_HEIGHT}
            sizes='100vw'
            className='block h-auto w-full'
            style={{ height: `${WAVE_HEIGHT}px` }}
            loading='lazy'
            quality={75}
          />
        </div>
      </div>
    </section>
  )
}
