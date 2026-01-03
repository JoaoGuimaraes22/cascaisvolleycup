'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import clsx from 'clsx'
import { Link } from '@/src/navigation'

export default function LandingWelcome() {
  const t = useTranslations('LandingPage.Welcome')
  const locale = useLocale()
  const [isLoaded, setIsLoaded] = useState(false)

  const ASSETS = useMemo(
    () => ({
      BG: '/img/landing/hero-bg-new.webp',
      TAGLINE: '/img/global/tagline-w.webp',
      LOGO: '/img/landing/hero-logo.png',
      SPONSOR: '/img/sponsors/cascais-camara-w.webp',
      OSPORTS: '/img/sponsors/o-sports-w.webp'
    }),
    []
  )

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

  // ✅ Instant load - no delay
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section
      role='region'
      aria-labelledby='hero-heading'
      className='relative -mt-16 min-h-screen w-full overflow-hidden md:-mt-20'
    >
      {/* ✅ SIMPLIFIED Background - No parallax, no refs, no transform */}
      <div className='absolute inset-0 z-0'>
        <Image
          src={ASSETS.BG}
          alt=''
          fill
          priority={true}
          quality={60}
          className='object-cover object-center'
          sizes='100vw'
          placeholder='blur'
          blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
        />
        {/* Gradient overlay */}
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
              src={ASSETS.SPONSOR}
              alt='Cascais Câmara Municipal'
              width={300}
              height={80}
              priority={true}
              quality={75}
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
              priority={true}
              quality={75}
              sizes='(max-width: 640px) 120px, (max-width: 1024px) 220px, 320px'
              className='h-auto w-[120px] drop-shadow-lg sm:w-[220px] lg:w-[320px]'
            />
          </div>
        </div>
      </div>

      {/* Main centered content */}
      <div className='relative z-10 mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col items-center justify-center px-6 sm:px-10 md:px-8'>
        {/* Main event logo */}
        <div className='relative'>
          <div
            className={clsx(
              'transition-all delay-300 duration-1000 ease-out',
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            )}
          >
            <Image
              src={ASSETS.LOGO}
              alt='Cascais Volley Cup 2026'
              width={650}
              height={227}
              priority={true}
              quality={75}
              sizes='(max-width: 640px) 350px, (max-width: 1024px) 500px, 650px'
              className='h-auto w-[350px] drop-shadow-2xl sm:w-[500px] md:w-[600px] lg:w-[650px]'
            />
          </div>
        </div>

        {/* Action buttons */}
        <div
          className={clsx(
            'mt-16 flex flex-col gap-3 transition-all delay-500 duration-700 ease-out',
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <Link
            href='/registration'
            className='rounded-full bg-white px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-sky-500 drop-shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg'
          >
            {t('register') || 'REGISTRATION'}
          </Link>

          <a
            href={`/docs/${getBrochureFileName}`}
            download={getBrochureFileName}
            className='rounded-full bg-white px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-sky-500 drop-shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg'
          >
            {t('brochure') || 'BROCHURES'}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={clsx(
          'absolute bottom-8 left-1/2 -translate-x-1/2 text-white transition-all delay-700 duration-1000 ease-out',
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

      {/* O-Sports logo */}
      <div
        className={clsx(
          'delay-900 absolute bottom-4 right-4 z-30 transition-all duration-700 ease-out',
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        <Image
          src={ASSETS.OSPORTS}
          alt='O-Sports'
          width={120}
          height={60}
          className='h-auto w-[80px] drop-shadow-lg sm:w-[100px] lg:w-[120px]'
          priority={false}
          quality={75}
        />
      </div>
    </section>
  )
}
