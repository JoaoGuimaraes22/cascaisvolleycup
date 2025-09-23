'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
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

  // ✅ Memoized assets for better performance
  const ASSETS = useMemo(
    () => ({
      BG: '/img/landing/hero-bg-new.webp',
      TAGLINE: '/img/global/tagline-w.webp',
      LOGO: '/img/global/cascais-volley-cup-1-w.webp',
      SPONSOR: '/img/sponsors/cascais-camara-w.webp',
      OSPORTS: '/img/sponsors/o-sports-w.webp'
    }),
    []
  )

  // ✅ Memoized brochure filename
  const getBrochureFileName = useMemo(() => {
    const languageMap = {
      en: 'UK',
      es: 'ESP',
      pt: 'PT',
      fr: 'FRAN'
    } as const

    const langCode = languageMap[locale as keyof typeof languageMap] || 'UK'
    return `CVCUP-2026-CONVITE-${langCode}.pdf`
  }, [locale])

  // ✅ Check if device is mobile (optimized)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // ✅ OPTIMIZED Parallax effect with GPU acceleration
  const handleScroll = useCallback(() => {
    if (isMobile) return
    setScrollY(window.scrollY)
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return

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
  }, [isMobile, handleScroll])

  // ✅ Load animation trigger
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
      {/* ✅ Background with optimized parallax */}
      <div className='absolute inset-0 z-0'>
        <Image
          src={ASSETS.BG}
          alt=''
          role='presentation'
          fill
          priority={true} // ✅ Hero image priority
          sizes='100vw'
          className='object-cover object-[center_60%] md:object-[center_58%] lg:object-[center_56%]'
          style={{
            transform: isMobile
              ? 'none'
              : `translate3d(0, ${scrollY * 0.5}px, 0)`, // ✅ GPU-accelerated transform
            willChange: isMobile ? 'auto' : 'transform' // ✅ Browser optimization hint
          }}
          quality={85}
        />
        {/* Gradient overlay for better text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/35 via-black/25 to-black/15' />
      </div>

      {/* ✅ Top overlay content */}
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
              src={ASSETS.SPONSOR}
              alt='Cascais Câmara Municipal'
              width={300}
              height={80}
              priority={true} // ✅ Important sponsor logo
              quality={85}
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
              src={ASSETS.TAGLINE}
              alt={t('tagline_alt') || 'feel the ACTION, enjoy the SUMMER'}
              width={400}
              height={100}
              priority={true} // ✅ Important tagline
              quality={85}
              sizes='(max-width: 640px) 120px, (max-width: 1024px) 220px, 320px'
              className='h-auto w-[120px] drop-shadow-lg sm:w-[220px] lg:w-[320px]'
            />
          </div>
        </div>
      </div>

      {/* ✅ Main centered content */}
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
              src={ASSETS.LOGO}
              alt='Cascais Volley Cup 2026'
              width={800}
              height={280}
              priority={true} // ✅ Most important image
              quality={90} // ✅ Highest quality for main logo
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
            href={`/docs/${getBrochureFileName}`}
            download={getBrochureFileName}
            className='rounded-full bg-white px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-sky-500 drop-shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg'
          >
            {t('brochure') || 'BROCHURES'}
          </a>
        </div>
      </div>

      {/* ✅ Scroll indicator - removed duplicate */}
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

      {/* ✅ O-Sports logo - bottom right of section */}
      <div
        className={clsx(
          'delay-1200 absolute bottom-4 right-4 z-30 transition-all duration-700 ease-out',
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        <Image
          src={ASSETS.OSPORTS}
          alt='O-Sports'
          width={120}
          height={60}
          className='h-auto w-[80px] drop-shadow-lg sm:w-[100px] lg:w-[120px]'
          priority={true} // ✅ Preload sponsor logo
          quality={85}
        />
      </div>
    </section>
  )
}
