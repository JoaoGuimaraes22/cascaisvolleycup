// src/app/[locale]/components/HallOfFame/HallOfFameWinners.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FaMedal, FaChevronDown, FaTrophy } from 'react-icons/fa'
import clsx from 'clsx'
import { useIntersectionObserver } from '@/src/hooks/useIntersectionObserver'
import { WAVE_HEIGHT, GLOBAL_ASSETS } from '@/src/lib/constants'
import {
  WINNERS,
  DIVISIONS,
  getAvailableYears,
  type DivisionKey
} from '@/src/data/winners'

export default function HallOfFameWinners() {
  const t = useTranslations('HallOfFamePage.Winners')
  const { ref: sectionRef, isVisible } = useIntersectionObserver<HTMLElement>()

  // Assets with better organization
  const ASSETS = {
    background: '/img/hall-of-fame/hero-bg.webp',
    winnersImg: '/img/program/players.webp',
    tagline: GLOBAL_ASSETS.tagline,
    wave: GLOBAL_ASSETS.wave
  } as const

  const years = getAvailableYears()
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
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-4 opacity-0'
                        )}
                        style={{
                          transitionDelay: `${500 + yearIndex * 100}ms`
                        }}
                      >
                        {/* Year Header - Clickable */}
                        <button
                          onClick={() => toggleYear(year)}
                          className='flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-50/80'
                          aria-expanded={openYear === year}
                          aria-controls={`winners-${year}`}
                        >
                          <div className='flex items-center gap-3'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 shadow-sm'>
                              <FaMedal className='h-4 w-4 text-white' />
                            </div>
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
                          id={`winners-${year}`}
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
                                                <FaTrophy className='h-3 w-3' />
                                              ) : (
                                                <span>{idx + 1}</span>
                                              )}
                                            </div>

                                            {/* Flag */}
                                            <Image
                                              src={flagSrc(country)}
                                              alt={country}
                                              width={20}
                                              height={14}
                                              className='h-3.5 w-5 shrink-0 rounded-[2px] object-cover shadow-sm ring-1 ring-black/10'
                                            />

                                            {/* Team Name */}
                                            <span className='text-sm font-medium text-slate-700'>
                                              {name}
                                            </span>
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

            {/* Right Column: Image */}
            <div className='hidden items-center justify-center lg:col-span-5 lg:flex'>
              <div
                className={clsx(
                  'relative h-[400px] w-full max-w-[520px] transition-all duration-1000 ease-out',
                  '[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)]',
                  '[mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)]',
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
          </div>
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
