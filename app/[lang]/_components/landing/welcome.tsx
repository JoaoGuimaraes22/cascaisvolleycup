'use client'

import { useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import type { Locale } from '@/i18n-config'
import { localeHref } from '../../_lib/seo'
import { getBrochureFileName, GLOBAL_ASSETS } from '../../_lib/constants'
import { useIsClient } from '../../_hooks/use-is-client'
import { useMediaQuery } from '../../_hooks/use-media-query'

type WelcomeDict = {
  tagline_alt: string
  taglineAlt: string
  heading: string
  PORTUGAL: string
  dates: string
  avg_air_temp: string
  avg_air_temp_value: string
  airport: string
  airport_value: string
  location: string
  location_value: string
  scrollDown: string
  register: string
  brochure: string
}

type Props = {
  lang: Locale
  dict: WelcomeDict
}

export default function LandingWelcome({ lang, dict }: Props) {
  const isLoaded = useIsClient()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const bgRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const lastScrollY = useRef(0)

  const ASSETS = useMemo(
    () => ({
      BG: '/img/landing/hero-bg-new.webp',
      TAGLINE: GLOBAL_ASSETS.taglineWhite,
      LOGO: '/img/landing/hero-logo.webp',
      SPONSOR: '/img/sponsors/cascais-camara-w.webp',
      OSPORTS: '/img/sponsors/o-sports-w.webp'
    }),
    []
  )

  const brochureFile = useMemo(() => getBrochureFileName(lang), [lang])

  // Parallax effect - DESKTOP ONLY
  useEffect(() => {
    if (!isDesktop || !bgRef.current) return

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY

        if (Math.abs(scrollY - lastScrollY.current) < 2) return

        if (scrollY < window.innerHeight && bgRef.current) {
          lastScrollY.current = scrollY
          bgRef.current.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isDesktop])

  return (
    <section
      role='region'
      aria-labelledby='hero-heading'
      className='relative -mt-16 min-h-screen w-full overflow-hidden md:-mt-20'
    >
      {/* Background - parallax on desktop, static on mobile */}
      <div className='absolute inset-0 z-0'>
        <div
          ref={bgRef}
          className='relative h-full w-full'
          style={isDesktop ? { willChange: 'transform' } : undefined}
        >
          <Image
            src={ASSETS.BG}
            alt=''
            fill
            priority
            sizes='100vw'
            className='object-cover'
            quality={85}
          />
        </div>
      </div>

      {/* Content overlay */}
      <div className='relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center'>
        {/* Tagline */}
        <div
          className={clsx(
            'mb-6 delay-100 duration-700 ease-out motion-safe:transition-all',
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <Image
            src={ASSETS.TAGLINE}
            alt={dict.taglineAlt}
            width={400}
            height={86}
            priority
            quality={95}
            sizes='(max-width: 640px) 280px, 400px'
            className='h-auto w-[280px] drop-shadow-2xl sm:w-[400px]'
          />
        </div>

        {/* Main heading (visually hidden but accessible) */}
        <h1 id='hero-heading' className='sr-only'>
          {dict.heading}
        </h1>

        {/* Logo */}
        <div className='flex flex-col items-center gap-4'>
          <div
            className={clsx(
              'delay-300 duration-700 ease-out motion-safe:transition-all',
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            )}
          >
            <Image
              src={ASSETS.LOGO}
              alt='Cascais Volley Cup 2026'
              width={650}
              height={227}
              priority={true}
              quality={95}
              sizes='(max-width: 640px) 350px, (max-width: 1024px) 500px, 650px'
              className='max-w-[350px] drop-shadow-2xl sm:max-w-[500px] md:max-w-[600px] lg:max-w-[650px]'
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div
          className={clsx(
            'mt-16 flex flex-col gap-3 delay-500 duration-700 ease-out motion-safe:transition-all',
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <Link
            href={localeHref(lang, '/registration')}
            className='rounded-full bg-white px-6 py-3 text-center text-sm font-bold tracking-wide text-sky-500 uppercase drop-shadow-lg duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-xl motion-safe:transition-all sm:px-8 sm:py-4 sm:text-lg'
          >
            {dict.register}
          </Link>

          <a
            href={`/docs/${brochureFile}`}
            download={brochureFile}
            className='rounded-full bg-white px-6 py-3 text-center text-sm font-bold tracking-wide text-sky-500 uppercase drop-shadow-lg duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-xl motion-safe:transition-all sm:px-8 sm:py-4 sm:text-lg'
          >
            {dict.brochure}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={clsx(
          'absolute bottom-8 left-1/2 -translate-x-1/2 text-white delay-700 duration-1000 ease-out motion-safe:transition-all',
          isLoaded ? 'translate-y-0 opacity-70' : 'translate-y-4 opacity-0'
        )}
      >
        <div className='flex flex-col items-center gap-2'>
          <span className='text-xs font-medium tracking-wider uppercase'>
            {dict.scrollDown}
          </span>
          <div className='h-8 w-px bg-white/60 motion-safe:animate-pulse' />
        </div>
      </div>

      {/* O-Sports logo */}
      <div
        className={clsx(
          'absolute right-4 bottom-4 z-30 h-[40px] w-[80px] delay-900 duration-700 ease-out motion-safe:transition-all sm:h-[50px] sm:w-[100px] lg:h-[60px] lg:w-[120px]',
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        <Image
          src={ASSETS.OSPORTS}
          alt='O-Sports'
          fill
          sizes='(max-width: 640px) 80px, (max-width: 1024px) 100px, 120px'
          className='object-contain drop-shadow-lg'
          quality={75}
        />
      </div>
    </section>
  )
}
