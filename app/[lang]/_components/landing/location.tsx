// OPTIMIZED LandingLocation - Intersection Observer for performance

'use client'

import Image from 'next/image'
import { FiMapPin } from 'react-icons/fi'
import clsx from 'clsx'
import { useState } from 'react'
import RegistrationToast from './registration-toast'
import { useIntersectionObserver } from '../../_hooks/use-intersection-observer'
import { WAVE_HEIGHT, GLOBAL_ASSETS } from '../../_lib/constants'

interface StatsListProps {
  items: string[]
  compact?: boolean
}

function StatsList({ items, compact = false }: StatsListProps) {
  return (
    <ul
      className={clsx(
        'flex flex-wrap items-center justify-center',
        compact ? 'gap-2' : 'gap-3 sm:gap-4 lg:gap-6'
      )}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={clsx(
            'flex items-center font-extrabold tracking-wide text-sky-600 uppercase',
            compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-lg lg:text-2xl',
            index < items.length - 1 && 'gap-2'
          )}
        >
          <span className='relative'>
            {item}
            <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 duration-500 hover:opacity-100 motion-safe:transition-opacity' />
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

type LocationDict = {
  title: string
  p1: string
  p2_prefix: string
  flixbus: string
  p2_suffix: string
  avg_air_temp: string
  avg_air_temp_value: string
  airport: string
  airport_value: string
  cta: string
  stats_teams: string
  stats_athletes: string
  stats_countries: string
  stats_games: string
  mapAlt: string
  taglineAlt: string
}

type ValidationErrorsDict = {
  nameRequired: string
  nameMinLength: string
  emailRequired: string
  emailInvalid: string
  clubRequired: string
  cityRequired: string
  countryRequired: string
  mobileInvalid: string
  fixErrors: string
}

type RegistrationFormDict = {
  FormTitle: string
  FormDescription: string
  Name: string
  NamePlaceholder: string
  Mobile: string
  Club: string
  ClubPlaceholder: string
  City: string
  CityPlaceholder: string
  Country: string
  CountryPlaceholder: string
  Questions: string
  QuestionsPlaceholder: string
  Submit: string
  Submitting: string
  SuccessMessage: string
  ErrorMessage: string
  ValidationErrors: ValidationErrorsDict
}

type Props = {
  dict: LocationDict
  registrationFormDict: RegistrationFormDict
}

export default function LandingLocation({ dict, registrationFormDict }: Props) {
  const [showRegistrationToast, setShowRegistrationToast] = useState(false)
  const { ref: sectionRef, isVisible } = useIntersectionObserver<HTMLElement>({
    rootMargin: '200px'
  })

  const ASSETS = {
    background: '/img/landing/home-page-2-2.webp',
    map: '/img/landing/mapa.webp',
    tagline: GLOBAL_ASSETS.tagline,
    wave: GLOBAL_ASSETS.wave
  } as const

  const STATS_DATA = [
    dict.stats_teams,
    dict.stats_athletes,
    dict.stats_countries,
    dict.stats_games
  ]

  const handlePlanTripClick = () => {
    setShowRegistrationToast(true)
  }

  return (
    <section
      ref={sectionRef}
      className='relative isolate min-h-[720px] overflow-hidden bg-white sm:min-h-[800px] lg:min-h-[880px]'
      style={{ paddingBottom: `${WAVE_HEIGHT}px` }}
    >
      {/* ✅ OPTIMIZED: Only render images when section is visible */}
      {isVisible && (
        <>
          {/* Background - Lazy load (below fold) */}
          <div className='absolute inset-0 -z-10 bg-white'>
            <Image
              src={ASSETS.background}
              alt=''
              fill
              priority={false}
              sizes='100vw'
              className='bg-white object-cover object-[50%_80%] md:object-[50%_78%] lg:object-[50%_76%]'
              quality={70}
            />
          </div>

          {/* Bottom Wave */}
          <div
            className='absolute inset-x-0 bottom-0 z-20'
            style={{ height: `${WAVE_HEIGHT}px` }}
          >
            <Image
              src={ASSETS.wave}
              alt=''
              fill
              priority={false}
              className='object-cover object-center'
              unoptimized
              sizes='100vw'
            />
          </div>
        </>
      )}

      {/* Content container */}
      <div className='mx-auto max-w-screen-xl px-4 pt-[clamp(32px,4vw,64px)] pb-10 sm:pb-12 lg:grid lg:h-full lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-8'>
        {/* Mobile Layout */}
        <div className='flex flex-col items-center space-y-6 lg:hidden'>
          {/* Text Content */}
          <div className='w-full max-w-md'>
            <h1 className='mb-4 text-left text-2xl font-extrabold tracking-wide text-sky-500 uppercase sm:text-3xl'>
              {dict.title}
            </h1>
            <div className='mb-6 space-y-4 text-left'>
              <p className='text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                {dict.p1}
              </p>
              <p className='text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                {dict.p2_prefix}
                <span className='font-extrabold text-sky-600'>
                  {dict.flixbus}
                </span>
                {dict.p2_suffix}
              </p>
            </div>
          </div>

          {/* Map - Only render when visible */}
          {isVisible && (
            <div className='w-full max-w-lg'>
              <div className='group rounded-lg bg-gradient-to-br from-sky-600 to-sky-700 p-[3px] shadow-xl ring-1 ring-black/5'>
                <div className='overflow-hidden rounded-md bg-white duration-300 group-hover:scale-[1.02] motion-safe:transition-transform'>
                  <Image
                    src={ASSETS.map}
                    alt={dict.mapAlt}
                    width={768}
                    height={456}
                    className='h-auto w-full object-cover'
                    priority={false}
                    sizes='(max-width: 768px) 90vw, 512px'
                    quality={75}
                    // ✅ REMOVED: loading='lazy'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className='w-full max-w-md py-4'>
            <StatsList items={STATS_DATA} compact />
          </div>

          {/* CTA Button */}
          <div>
            <button
              type='button'
              onClick={handlePlanTripClick}
              className='group relative overflow-hidden rounded-full bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-3 text-sm font-bold text-white shadow-xl ring-1 ring-black/10 duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-safe:transition-all sm:text-base'
            >
              <span className='relative z-10 flex items-center gap-2'>
                <FiMapPin className='h-4 w-4' />
                {dict.cta}
              </span>
              <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent duration-700 group-hover:translate-x-full motion-safe:transition-transform' />
            </button>
          </div>

          {/* Tagline */}
          {isVisible && (
            <div className='w-[260px] sm:w-[320px]'>
              <Image
                src={ASSETS.tagline}
                alt={dict.taglineAlt}
                width={1000}
                height={215}
                className='h-auto w-full object-contain drop-shadow-lg'
                sizes='(max-width: 640px) 260px, 320px'
                quality={75}
                priority={false}
              />
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className='hidden lg:contents'>
          {/* Top Left: Text Content */}
          <div className='flex flex-col'>
            <h1 className='mb-4 text-3xl font-extrabold tracking-wide text-sky-500 uppercase lg:text-[32px]'>
              {dict.title}
            </h1>
            <div className='space-y-4'>
              <p className='max-w-prose text-base leading-relaxed text-slate-800/90'>
                {dict.p1}
              </p>
              <p className='max-w-prose text-base leading-relaxed text-slate-800/90'>
                {dict.p2_prefix}
                <span className='font-extrabold text-sky-600'>
                  {dict.flixbus}
                </span>
                {dict.p2_suffix}
              </p>
            </div>

            {/* Stats */}
            <div className='mt-8'>
              <StatsList items={STATS_DATA} />
            </div>
          </div>

          {/* Top Right: Tagline */}
          {isVisible && (
            <div className='flex items-start justify-end'>
              <div className='w-[380px] xl:w-[420px]'>
                <Image
                  src={ASSETS.tagline}
                  alt={dict.taglineAlt}
                  width={1000}
                  height={215}
                  className='h-auto w-full object-contain drop-shadow-lg'
                  sizes='420px'
                  quality={75}
                  priority={false}
                />
              </div>
            </div>
          )}

          {/* Bottom Left: Map */}
          {isVisible && (
            <div className='flex items-start justify-start'>
              <div className='group max-w-[540px] rounded-lg bg-gradient-to-br from-sky-600 to-sky-700 p-[3px] shadow-xl ring-1 ring-black/5'>
                <div className='overflow-hidden rounded-md bg-white duration-300 group-hover:scale-[1.02] motion-safe:transition-transform'>
                  <Image
                    src={ASSETS.map}
                    alt={dict.mapAlt}
                    width={768}
                    height={456}
                    className='h-auto w-full object-cover'
                    priority={false}
                    sizes='540px'
                    quality={75}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Right: CTA Button */}
          <div className='flex items-end justify-end'>
            <button
              type='button'
              onClick={handlePlanTripClick}
              className='group relative overflow-hidden rounded-full bg-gradient-to-r from-sky-600 to-sky-700 px-8 py-4 text-base font-bold text-white shadow-xl ring-1 ring-black/10 duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-safe:transition-all'
            >
              <span className='relative z-10 flex items-center gap-2'>
                <FiMapPin className='h-5 w-5' />
                {dict.cta}
              </span>
              <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent duration-700 group-hover:translate-x-full motion-safe:transition-transform' />
            </button>
          </div>
        </div>
      </div>

      {showRegistrationToast && (
        <RegistrationToast
          isOpen={showRegistrationToast}
          onClose={() => setShowRegistrationToast(false)}
          dict={registrationFormDict}
        />
      )}
    </section>
  )
}
