'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import clsx from 'clsx'
import { Link } from '@/src/navigation'

export default function LandingWelcome() {
  const t = useTranslations('LandingPage.Welcome')
  const locale = useLocale()
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Assets
  const BG = '/img/landing/hero-bg-new.webp'
  const TAGLINE = '/img/global/tagline-w.webp'
  const LOGO = '/img/global/cascais-volley-cup-1-w.webp'
  const SPONSOR = '/img/sponsors/cascais-camara-w.webp'
  const OSPORTS = '/img/sponsors/o-sports-w.webp'

  // Language mapping for brochure files
  const getLanguageCode = (locale: string) => {
    const languageMap = {
      en: 'UK',
      es: 'ESP',
      pt: 'PT',
      fr: 'FRAN'
    } as const

    return languageMap[locale as keyof typeof languageMap] || 'UK'
  }

  const getBrochureFileName = () => {
    const langCode = getLanguageCode(locale)
    return `CVCUP-2026-CONVITE-${langCode}.pdf`
  }

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Parallax effect for background (disabled on mobile)
  useEffect(() => {
    if (isMobile) return

    const handleScroll = () => setScrollY(window.scrollY)

    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [isMobile])

  // Load animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      role='region'
      aria-labelledby='hero-heading'
      className='relative -mt-16 min-h-screen w-full overflow-hidden md:-mt-20'
    >
      {/* Background with parallax disabled on mobile */}
      <div className='absolute inset-0 z-0'>
        <Image
          src={BG}
          alt=''
          role='presentation'
          fill
          priority
          sizes='100vw'
          className='object-cover object-[center_60%] md:object-[center_58%] lg:object-[center_56%]'
          style={{
            transform: isMobile ? 'none' : `translateY(${scrollY * 0.5}px)`
          }}
          quality={85}
        />
        {/* Gradient overlay for better text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/35 via-black/25 to-black/15' />
      </div>

      {/* Top overlay content */}
      <div className='absolute left-0 right-0 top-0 z-20 px-6 pt-20 sm:px-10 sm:pt-24 md:px-8 md:pt-28'>
        <div className='mx-auto flex max-w-screen-2xl items-start justify-between'>
          {/* Sponsor logo - top left */}
          <div
            className={clsx(
              'transition-all duration-1000 ease-out',
              isLoaded
                ? 'translate-x-0 opacity-100'
                : '-translate-x-8 opacity-0'
            )}
          >
            <Image
              src={SPONSOR}
              alt='Cascais Câmara Municipal'
              width={300}
              height={80}
              loading='eager'
              quality={80}
              sizes='(max-width: 640px) 100px, (max-width: 1024px) 180px, 280px'
              className='h-auto w-[100px] drop-shadow-lg sm:w-[180px] lg:w-[280px]'
            />
          </div>

          {/* Tagline - top right */}
          <div
            className={clsx(
              'transition-all duration-1000 ease-out',
              isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            )}
          >
            <Image
              src={TAGLINE}
              alt={t('tagline_alt') || 'feel the ACTION, enjoy the SUMMER'}
              width={400}
              height={100}
              loading='eager'
              quality={80}
              sizes='(max-width: 640px) 120px, (max-width: 1024px) 220px, 320px'
              className='h-auto w-[120px] drop-shadow-lg sm:w-[220px] lg:w-[320px]'
            />
          </div>
        </div>
      </div>

      {/* Main centered content */}
      <div className='relative z-10 mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col items-center justify-center px-6 sm:px-10 md:px-8'>
        {/* Main event logo with positioned labels */}
        <div className='relative'>
          {/* Portugal label - anchored to top right of logo */}
          <div
            className={clsx(
              'absolute right-0 top-0 transition-all delay-300 duration-700 ease-out',
              isLoaded
                ? 'translate-y-0 opacity-100'
                : '-translate-y-4 opacity-0'
            )}
          >
            <p className='text-lg uppercase tracking-[0.3em] text-white drop-shadow-md sm:text-xl md:text-2xl'>
              {t('PORTUGAL') || 'PORTUGAL'}
            </p>
          </div>

          {/* Logo */}
          <div
            className={clsx(
              'transition-all delay-500 duration-1000 ease-out',
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            )}
          >
            <Image
              src={LOGO}
              alt='Cascais Volley Cup 2026'
              width={800}
              height={280}
              priority
              quality={80}
              sizes='(max-width: 640px) 350px, (max-width: 1024px) 500px, 650px'
              className='h-auto w-[350px] drop-shadow-2xl sm:w-[500px] md:w-[600px] lg:w-[650px]'
            />
          </div>

          {/* Dates - anchored to bottom right of logo */}
          <div
            className={clsx(
              'absolute bottom-0 right-0 transition-all delay-700 duration-700 ease-out',
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            )}
          >
            <p className='text-xl uppercase tracking-wide text-white drop-shadow-md sm:text-2xl md:text-3xl'>
              {t('dates') || '8 — 12 JULHO'}
            </p>
          </div>
        </div>

        {/* Action buttons - stacked vertically */}
        <div
          className={clsx(
            'delay-900 mt-16 flex flex-col gap-3 transition-all duration-700 ease-out',
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <Link
            href='/registration'
            className='rounded-full bg-white px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-sky-500 drop-shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg'
          >
            {t('register') || 'REGISTRATION'}
          </Link>

          {/* Brochure download button with locale-based filename */}
          <a
            href={`/docs/${getBrochureFileName()}`}
            download={getBrochureFileName()}
            className='rounded-full bg-white px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-sky-500 drop-shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg'
          >
            {t('brochure') || 'BROCHURES'}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={clsx(
          'absolute bottom-8 left-1/2 -translate-x-1/2 text-white transition-all delay-1000 duration-1000 ease-out',
          isLoaded ? 'translate-y-0 opacity-70' : 'translate-y-4 opacity-0'
        )}
      >
        <div className='flex flex-col items-center gap-2'>
          <span className='text-xs font-medium uppercase tracking-wider'>
            {t('scrollDown') || 'SCROLL DOWN'}
          </span>
          <div className='h-8 w-px animate-pulse bg-white/60' />
        </div>
      </div>

      <div
        className={clsx(
          'absolute bottom-8 left-1/2 -translate-x-1/2 text-white transition-all delay-1000 duration-1000 ease-out',
          isLoaded ? 'translate-y-0 opacity-70' : 'translate-y-4 opacity-0'
        )}
      >
        <div className='flex flex-col items-center gap-2'>
          <span className='text-xs font-medium uppercase tracking-wider'>
            {t('scrollDown') || 'SCROLL DOWN'}
          </span>
          <div className='h-8 w-px animate-pulse bg-white/60' />
        </div>
      </div>

      {/* O-Sports logo - bottom right of section */}
      <div
        className={clsx(
          'delay-1200 absolute bottom-4 right-4 z-30 transition-all duration-700 ease-out',
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        <Image
          src={OSPORTS}
          alt='O-Sports'
          width={120}
          height={60}
          className='h-auto w-[80px] drop-shadow-lg sm:w-[100px] lg:w-[120px]'
          loading='lazy'
          quality={80}
        />
      </div>
    </section>
  )
}
