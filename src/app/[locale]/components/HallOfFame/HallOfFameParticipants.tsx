'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { FiUsers, FiArrowDown, FiFlag } from 'react-icons/fi'
import clsx from 'clsx'

// Assets constant for better maintainability
const ASSETS = {
  background: '/img/hall-of-fame/hero-bg.webp',
  players: '/img/hall-of-fame/players-2.webp',
  wave: '/img/global/ondas-7.webp'
} as const

const WAVE_HEIGHT = 135

// Team data type
interface Team {
  name: string
  country: string
}

// Sample teams data - all Portuguese teams
const SAMPLE_TEAMS: Team[] = [
  // ESPANHA
  { name: 'CV Madrid', country: 'ES' },
  { name: 'Dompa Ourense Volei', country: 'ES' },

  // MÓNACO
  { name: 'AS Monaco', country: 'MC' },
  // PORTUGAL
  { name: 'CF "Os Belenenses"', country: 'PT' },
  { name: 'Lusófona VC', country: 'PT' },
  { name: 'Cascais Volley4all', country: 'PT' },
  { name: 'PEL Amora SC', country: 'PT' },
  { name: 'CJS Arouca', country: 'PT' },
  { name: 'Santiago V4A', country: 'PT' },
  { name: 'AR Canidelo', country: 'PT' },
  { name: 'AV Atlântico', country: 'PT' },
  { name: 'SC Vila Real', country: 'PT' },
  { name: 'CV Aveiro', country: 'PT' },
  { name: 'RC Santarém', country: 'PT' },
  { name: 'SC Arcozelo', country: 'PT' },
  { name: 'Madeira Torres', country: 'PT' },
  { name: 'São Francisco AD', country: 'PT' },
  { name: 'GDC Gueifães', country: 'PT' },
  { name: 'TC Alcochete', country: 'PT' },
  { name: 'AA Coimbra', country: 'PT' },
  { name: 'Lousada VC', country: 'PT' },
  { name: 'CA Madalena', country: 'PT' },
  { name: 'CV Póvoa', country: 'PT' },
  { name: 'AD Esposende', country: 'PT' },
  { name: 'Frei Gil VC', country: 'PT' },
  { name: 'CD Foz Porto', country: 'PT' },
  { name: 'Col. Julio Dinis', country: 'PT' },
  { name: 'Juventude SC', country: 'PT' },
  { name: 'CRCD Luzense', country: 'PT' },
  { name: 'Sporting CT', country: 'PT' }
] as const

// Custom hook for intersection observer with staggered animations
function useStaggeredAnimation(threshold = 0.15) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold, rootMargin: '50px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { isVisible, sectionRef }
}

// Team item component without hover animations
interface TeamItemProps {
  team: Team
  index: number
  isVisible: boolean
}

function TeamItem({ team, index, isVisible }: TeamItemProps) {
  const flagSrc = (code: string) =>
    `/img/hall-of-fame/${code.toLowerCase()}.svg`

  return (
    <li
      className={clsx(
        'flex items-center gap-3 rounded-lg bg-white/60 px-3 py-2 shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-all duration-500 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}
      style={{
        transitionDelay: `${700 + Math.floor(index / 2) * 100}ms`
      }}
    >
      {/* Flag - Portugal for all teams */}
      <div className='relative inline-block h-[16px] w-[24px] shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10'>
        <Image
          src={flagSrc(team.country)}
          alt={`${team.country} flag`}
          fill
          sizes='24px'
          className='object-cover'
          quality={75}
          loading='lazy'
        />
      </div>

      {/* Team name - no hover effects */}
      <span className='flex-1 text-sm font-medium text-slate-800 sm:text-base'>
        {team.name}
      </span>
    </li>
  )
}

// Simplified players image with only hover animation
interface PlayersImageProps {
  src: string
  alt: string
  isVisible: boolean
}

function PlayersImage({ src, alt, isVisible }: PlayersImageProps) {
  return (
    <div className='relative hidden lg:col-span-6 lg:block'>
      <div
        className={clsx(
          'relative z-10 mx-auto -mt-2 h-[340px] w-full overflow-visible transition-all duration-1000 ease-out sm:-mt-4 sm:h-[420px] lg:-mt-6 lg:h-[520px]',
          '[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_75%,transparent_100%)]',
          '[mask-image:linear-gradient(to_bottom,black_0%,black_75%,transparent_100%)]',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        )}
        style={{
          transitionDelay: '200ms'
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes='(max-width: 1024px) 90vw, 760px'
          className='object-contain object-bottom transition-transform duration-300 hover:scale-105'
          priority
          quality={80}
        />
      </div>
    </div>
  )
}

// Enhanced CTA button
interface CTAButtonProps {
  onClick: () => void
  children: React.ReactNode
  isVisible: boolean
}

function CTAButton({ onClick, children, isVisible }: CTAButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={clsx(
        'group relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-sky-700 to-sky-800 px-6 py-3 text-sm font-bold text-white shadow-xl ring-1 ring-black/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 sm:text-base',
        'transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      )}
      style={{ transitionDelay: '900ms' }}
    >
      <span className='relative z-10 flex items-center gap-2'>
        <FiUsers className='h-4 w-4' />
        {children}
        <FiArrowDown className='h-4 w-4 transition-transform duration-300 group-hover:translate-y-1' />
      </span>
      {/* Shimmer effect */}
      <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full' />
    </button>
  )
}

// Enhanced wave section with stats
interface WaveSectionProps {
  statsItems: string[]
  isVisible: boolean
}

function WaveSection({ statsItems, isVisible }: WaveSectionProps) {
  return (
    <div className='pointer-events-none absolute bottom-0 left-1/2 w-screen -translate-x-1/2'>
      <div
        className={clsx(
          'relative transition-all duration-1000 ease-out',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
        style={{
          backgroundImage: `url(${ASSETS.wave})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: `${WAVE_HEIGHT}px`,
          transitionDelay: '1000ms'
        }}
      ></div>
    </div>
  )
}

export default function HallOfFameParticipants() {
  const t = useTranslations('HallOfFamePage.Participants')
  const { isVisible, sectionRef } = useStaggeredAnimation(0.15)
  const [showAllTeams, setShowAllTeams] = useState(false)

  // Show first 7 teams on mobile, all on desktop
  const visibleTeams = showAllTeams ? SAMPLE_TEAMS : SAMPLE_TEAMS.slice(0, 7)
  const hasMoreTeams = SAMPLE_TEAMS.length > 7

  const handleSeeWinners = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById('hall-of-fame-winners')
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  const handleSeeMoreTeams = () => {
    setShowAllTeams(true)
  }

  const statsItems = [
    t('stats.teams'),
    t('stats.athletes'),
    t('stats.countries'),
    t('stats.games')
  ]

  return (
    <section
      ref={sectionRef}
      id='hall-of-fame-teams'
      className='relative w-full overflow-hidden'
      aria-labelledby='participants-title'
    >
      {/* Background - Default background for desktop */}
      <div className='absolute inset-0 -z-20 hidden lg:block'>
        <Image
          src={ASSETS.background}
          alt=''
          role='presentation'
          fill
          priority
          sizes='100vw'
          className='object-cover'
          quality={75}
        />
      </div>

      {/* Mobile Background - Players image as background with opacity and greyscale */}
      <div className='absolute inset-0 -z-10 lg:hidden'>
        {/* Original background */}
        <Image
          src={ASSETS.background}
          alt=''
          role='presentation'
          fill
          priority
          sizes='100vw'
          className='object-cover'
          quality={75}
        />
        {/* Players image overlay */}
        <div className='absolute inset-0'>
          <Image
            src={ASSETS.players}
            alt=''
            role='presentation'
            fill
            sizes='100vw'
            className='object-contain object-bottom opacity-30 grayscale'
            loading='lazy'
            quality={80}
          />
        </div>
      </div>

      {/* Content */}
      <div
        className='mx-auto max-w-screen-xl px-4 pt-8 sm:pt-12 lg:pb-[135px]'
        style={{ paddingBottom: `calc(${WAVE_HEIGHT}px + 12px)` }}
      >
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
          {/* Enhanced Left: players image (Desktop only) */}
          <PlayersImage
            src={ASSETS.players}
            alt={t('playersAlt')}
            isVisible={isVisible}
          />

          {/* Enhanced Content Section */}
          <div className='lg:col-span-6'>
            <header>
              <h2
                id='participants-title'
                className={clsx(
                  'mb-4 text-xl font-extrabold uppercase tracking-wide text-sky-500 transition-all duration-1000 ease-out sm:text-2xl',
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
                )}
                style={{ transitionDelay: '400ms' }}
              >
                {t('title')}
              </h2>
            </header>

            {/* Teams grid with mobile limitation */}
            <div
              className={clsx(
                'transition-all duration-1000 ease-out',
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              )}
              style={{ transitionDelay: '600ms' }}
            >
              {/* Desktop: Show all teams */}
              <ul className='hidden grid-cols-1 gap-3 text-sm sm:grid sm:grid-cols-2 sm:text-base lg:gap-2'>
                {SAMPLE_TEAMS.map((team, index) => (
                  <TeamItem
                    key={`${team.name}-${index}`}
                    team={team}
                    index={index}
                    isVisible={isVisible}
                  />
                ))}
              </ul>

              {/* Mobile: Show limited teams */}
              <ul className='grid grid-cols-1 gap-3 text-sm sm:hidden'>
                {visibleTeams.map((team, index) => (
                  <TeamItem
                    key={`${team.name}-${index}`}
                    team={team}
                    index={index}
                    isVisible={isVisible}
                  />
                ))}
              </ul>

              {/* Mobile: See More Teams button */}
              {hasMoreTeams && !showAllTeams && (
                <button
                  type='button'
                  onClick={handleSeeMoreTeams}
                  className={clsx(
                    'mt-4 inline-flex items-center gap-2 rounded-lg bg-white/70 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:hidden',
                    'transition-all duration-700 ease-out',
                    isVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-6 opacity-0'
                  )}
                  style={{ transitionDelay: '800ms' }}
                >
                  <FiUsers className='h-4 w-4' />
                  See {SAMPLE_TEAMS.length - 7} more teams
                  <FiArrowDown className='h-4 w-4' />
                </button>
              )}

              <CTAButton onClick={handleSeeWinners} isVisible={isVisible}>
                {t('seeWinners')}
              </CTAButton>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced wave section with stats */}
      <WaveSection statsItems={statsItems} isVisible={isVisible} />
    </section>
  )
}
