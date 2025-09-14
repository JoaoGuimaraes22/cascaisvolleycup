'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'
import { useMemo, useEffect, useRef, useState } from 'react'

// Constants for better maintainability
const ASSETS = {
  background: '/img/competition/rulles-bg.webp',
  wave: '/img/global/ondas-3.webp'
} as const

const WAVE_HEIGHT = 135

// Types for better type safety
interface FactItem {
  id: string
  heading: string
  lines: (string | JSX.Element)[]
}

interface StatsListProps {
  items: string[]
  compact?: boolean
}

export default function CompetitionFacts() {
  const t = useTranslations('CompetitionPage.Facts')
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Intersection observer for scroll animations
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

  // Memoize fact items to prevent unnecessary re-renders
  const factItems = useMemo<FactItem[]>(
    () => [
      {
        id: 'ages',
        heading: t('ages.heading'),
        lines: [
          <span key='u15-1'>
            <strong className='font-extrabold text-white'>Under 15</strong>
          </span>,
          '(<2011)',
          <span key='u17'>
            <strong className='font-extrabold text-white'>Under 17</strong>
          </span>,
          '(2010-2009)',
          <span key='open'>
            <strong className='font-extrabold text-white'>Open</strong>
          </span>,
          '(>2008)'
        ]
      },
      {
        id: 'who',
        heading: t('who.heading'),
        lines: [
          <strong key='who-1' className='font-extrabold text-white'>
            {t('who.l1')}
          </strong>,
          <strong key='who-2' className='font-extrabold text-white'>
            {t('who.l2')}
          </strong>,
          <strong key='who-3' className='font-extrabold text-white'>
            {t('who.l3')}
          </strong>,
          <strong key='who-4' className='font-extrabold text-white'>
            {t('who.l4')}
          </strong>,
          <strong key='who-5' className='font-extrabold text-white'>
            {t('who.l5')}
          </strong>
        ].filter(Boolean)
      },
      {
        id: 'wherewhen',
        heading: t('wherewhen.heading'),
        lines: [
          t('wherewhen.l1'),
          t('wherewhen.l2') && (
            <strong
              key='wherewhen-emphasis'
              className='font-extrabold text-white'
            >
              {t('wherewhen.l2')}
            </strong>
          ),
          t('wherewhen.l3')
        ].filter(Boolean)
      },
      {
        id: 'games',
        heading: t('games.heading'),
        lines: [
          <span key='games-max'>
            <strong className='font-extrabold text-white'>Maximum</strong>
          </span>,
          '8 matches',
          <span key='games-min'>
            <strong className='font-extrabold text-white'>Minimum</strong>
          </span>,
          '6 matches'
        ]
      }
    ],
    [t]
  )

  const statsItems = useMemo(
    () =>
      [
        t('stats.teams'),
        t('stats.athletes'),
        t('stats.countries'),
        t('stats.games')
      ].filter(Boolean),
    [t]
  )

  return (
    <section
      ref={sectionRef}
      className='relative w-full overflow-hidden'
      style={{ paddingBottom: `${WAVE_HEIGHT}px` }}
      aria-labelledby='competition-facts-title'
      id='regulations'
    >
      {/* Hidden title for screen readers */}
      <h2 id='competition-facts-title' className='sr-only'>
        {t('sectionTitle') || 'Competition Facts and Information'}
      </h2>

      {/* Background Image */}
      <div className='absolute inset-0 -z-10'>
        <Image
          src={ASSETS.background}
          alt=''
          fill
          sizes='100vw'
          className='object-cover'
          quality={80}
          loading='eager'
          draggable={false}
          aria-hidden='true'
        />
      </div>

      {/* Main Content */}
      <div className='relative z-10 mx-auto max-w-screen-xl px-4 py-16 sm:py-20 lg:py-24'>
        <FactsGrid items={factItems} isVisible={isVisible} />
      </div>

      {/* Wave Section with Stats */}
      <WaveSection statsItems={statsItems} isVisible={isVisible} />
    </section>
  )
}

// Facts grid component with animations
function FactsGrid({
  items,
  isVisible
}: {
  items: FactItem[]
  isVisible: boolean
}) {
  return (
    <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6'>
      {items.map((item, index) => (
        <FactCard
          key={item.id}
          item={item}
          index={index}
          isVisible={isVisible}
        />
      ))}
    </div>
  )
}

// Individual fact card with staggered animations
function FactCard({
  item,
  index,
  isVisible
}: {
  item: FactItem
  index: number
  isVisible: boolean
}) {
  if (!item.heading || item.lines.length === 0) return null

  const delay = index * 150 // Staggered animation delay

  return (
    <article
      className={clsx(
        'flex flex-col items-center gap-4 text-center transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Title - Outside and above the pin */}
      <h3 className='text-lg font-extrabold uppercase tracking-wide text-sky-600 sm:text-xl lg:text-2xl'>
        {item.heading}
      </h3>

      {/* Pin-shaped container with content */}
      <PinContainer index={index} isVisible={isVisible} delay={delay}>
        <div className='space-y-3'>
          {/* Content lines only */}
          <div className='space-y-2'>
            {item.lines.map((line, lineIndex) => (
              <p
                key={lineIndex}
                className='text-sm leading-relaxed text-white/90 sm:text-base'
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </PinContainer>
    </article>
  )
}

// Pin-shaped container component
function PinContainer({
  children,
  index,
  isVisible,
  delay
}: {
  children: React.ReactNode
  index: number
  isVisible: boolean
  delay: number
}) {
  return (
    <div
      className={clsx(
        'group relative transition-all duration-700 ease-out',
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      )}
      style={{
        transitionDelay: `${delay}ms`,
        width: '260px',
        height: '320px'
      }}
    >
      {/* Pin Shape SVG */}
      <svg
        viewBox='0 0 120 160'
        className='h-full w-full drop-shadow-2xl transition-transform duration-300 group-hover:scale-105'
        aria-hidden='true'
      >
        <defs>
          {/* Blue gradient for the pin */}
          <linearGradient
            id={`pin-gradient-${index}`}
            x1='0%'
            y1='0%'
            x2='100%'
            y2='100%'
          >
            <stop offset='0%' stopColor='#0ea5e9' />
            <stop offset='50%' stopColor='#0284c7' />
            <stop offset='100%' stopColor='#0369a1' />
          </linearGradient>

          {/* Inner lighter blue gradient */}
          <linearGradient
            id={`pin-inner-gradient-${index}`}
            x1='0%'
            y1='0%'
            x2='100%'
            y2='100%'
          >
            <stop offset='0%' stopColor='#38bdf8' />
            <stop offset='50%' stopColor='#0ea5e9' />
            <stop offset='100%' stopColor='#0284c7' />
          </linearGradient>

          {/* White border gradient */}
          <linearGradient
            id={`pin-border-gradient-${index}`}
            x1='0%'
            y1='0%'
            x2='100%'
            y2='100%'
          >
            <stop offset='0%' stopColor='#ffffff' />
            <stop offset='50%' stopColor='#f8fafc' />
            <stop offset='100%' stopColor='#e2e8f0' />
          </linearGradient>
        </defs>

        {/* Main blue pin shape - full pin */}
        <path
          d='M60 0C26.863 0 0 26.863 0 60c0 45 60 100 60 100s60-55 60-100C120 26.863 93.137 0 60 0z'
          fill={`url(#pin-gradient-${index})`}
          stroke='none'
        />

        {/* Inner highlight for depth */}
        <path
          d='M60 8C32.386 8 10 30.386 10 58c0 35.5 50 80 50 80s50-44.5 50-80C110 30.386 87.614 8 60 8z'
          fill={`url(#pin-inner-gradient-${index})`}
        />

        {/* Bottom accent for more depth */}
        <ellipse
          cx='60'
          cy='54'
          rx='25'
          ry='8'
          fill='rgba(59, 130, 246, 0.3)'
          transform='rotate(-10 60 54)'
        />
      </svg>

      {/* Content overlay */}
      <div className='absolute inset-0 flex items-center justify-center px-6 pb-16'>
        <div className='transform text-center transition-transform duration-300 group-hover:scale-105'>
          {children}
        </div>
      </div>
    </div>
  )
}

// Wave section with statistics and animations
function WaveSection({
  statsItems,
  isVisible
}: {
  statsItems: string[]
  isVisible: boolean
}) {
  return (
    <div className='absolute bottom-0 left-1/2 w-screen -translate-x-1/2'>
      {/* Wave Image */}
      <Image
        src={ASSETS.wave}
        alt=''
        width={2048}
        height={WAVE_HEIGHT}
        className='-mb-px block w-full object-cover'
        style={{ height: `${WAVE_HEIGHT}px` }}
        sizes='100vw'
        quality={85}
        loading='lazy'
        draggable={false}
        aria-hidden='true'
      />

      {/* Statistics Overlay */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='mx-auto flex h-full max-w-screen-xl items-center justify-center px-4 lg:justify-end lg:px-8'>
          <div
            className={clsx(
              'transition-all duration-1000 ease-out',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            )}
            style={{ transitionDelay: '800ms' }}
          >
            {/* Mobile: Compact Layout */}
            <div className='block lg:hidden'>
              <StatsList compact items={statsItems} />
            </div>

            {/* Desktop: Standard Layout */}
            <div className='hidden lg:block'>
              <StatsList items={statsItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced statistics list component
function StatsList({ items, compact = false }: StatsListProps) {
  if (items.length === 0) return null

  return (
    <div
      role='region'
      aria-label={
        compact ? 'Tournament statistics (compact)' : 'Tournament statistics'
      }
    >
      <ul
        className={clsx(
          'flex items-center whitespace-nowrap font-extrabold uppercase text-white drop-shadow-lg',
          compact
            ? 'gap-2 text-[10px] tracking-tight'
            : 'gap-3 text-[11px] tracking-normal sm:gap-4 sm:text-[13px] sm:tracking-wide lg:gap-6 lg:text-lg'
        )}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={clsx(
              'flex items-center transition-all duration-300 hover:scale-105',
              compact ? 'gap-1' : 'gap-2 lg:gap-4'
            )}
          >
            <span className='relative'>
              {item}
              <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100' />
            </span>
            {index < items.length - 1 && (
              <span
                className={clsx(
                  'leading-none text-cyan-300',
                  compact ? 'text-xs' : 'text-sm sm:text-base lg:text-xl'
                )}
                aria-hidden='true'
              >
                •
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
