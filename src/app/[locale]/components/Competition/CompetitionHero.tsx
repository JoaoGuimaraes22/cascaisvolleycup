'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { MouseEvent } from 'react'

// Constants for better maintainability
const ASSETS = {
  BG: '/img/competition/hero-bg.webp',
  PHONE: '/img/global/hand-phone.webp',
  MOSAIC: '/img/competition/mosaic.webp',
  MOSAIC_MOBILE: '/img/competition/mosaic-2.webp',
  LOGO: '/img/global/cascais-volley-cup-1-w.webp',
  TAGLINE: '/img/global/tagline-w.webp'
} as const

const PHONE_DIMENSIONS = {
  mobile: { width: 200, height: 256 },
  tablet: { width: 230, height: 288 },
  desktop: { width: 260, height: 300 },
  large: { width: 280, height: 320 },
  xl: { width: 300, height: 340 }
} as const

const LOGO_DIMENSIONS = {
  width: 420,
  height: 160
} as const

const TAGLINE_DIMENSIONS = {
  width: 400,
  height: 140
} as const

// Utility function to parse text with **bold** markers
function parseBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2)
      return (
        <span key={index} className='font-bold'>
          {boldText}
        </span>
      )
    }
    return part
  })
}

export default function CompetitionHero() {
  const t = useTranslations('CompetitionPage.Hero')
  const tLogo = useTranslations('CompetitionPage.LogoTaglineHero')

  const handleScrollToRegulations = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const regulationsSection = document.getElementById('regulations')

    if (!regulationsSection) {
      window.location.hash = '#regulations'
      return
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    regulationsSection.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    })
  }

  return (
    <section
      className='relative w-full overflow-hidden'
      aria-labelledby='competition-hero-title'
    >
      {/* Background with loading optimization */}
      <div className='absolute inset-0 -z-10'>
        <Image
          src={ASSETS.BG}
          alt=''
          fill
          priority
          className='object-cover'
          sizes='100vw'
          quality={75}
          placeholder='blur'
          blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
          draggable={false}
        />
      </div>

      {/* Mobile: Phone Image Behind Content - Greyscaled and Opaque */}
      <div className='pointer-events-none absolute inset-0 z-0 md:hidden'>
        <Image
          src={ASSETS.PHONE}
          alt=''
          role='presentation'
          fill
          className='object-contain object-center opacity-30 grayscale'
          sizes='100vw'
          loading='eager'
        />
      </div>

      {/* Main Content Container */}
      <div className='relative z-10 mx-auto max-w-screen-xl px-4 py-10 sm:py-12 lg:py-16'>
        <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10'>
          {/* Phone Image Section - Desktop Only */}
          <div className='hidden md:col-span-5 md:block'>
            <div className='phone-container relative -ml-4 sm:-ml-6 md:-ml-14 lg:-ml-[8vw] xl:-ml-[9vw] 2xl:-ml-[10vw]'>
              <Image
                src={ASSETS.PHONE}
                alt={
                  t('phoneAlt') ||
                  "Mobile app preview showing the competition interface in someone's hand"
                }
                width={PHONE_DIMENSIONS.xl.width}
                height={PHONE_DIMENSIONS.xl.height}
                className='h-auto w-auto max-w-none object-contain object-left drop-shadow-2xl transition-transform duration-300 hover:scale-105'
                sizes='(max-width: 640px) 200px, (max-width: 768px) 230px, (max-width: 1024px) 260px, (max-width: 1280px) 280px, 300px'
                loading='eager'
                quality={90}
                draggable={false}
              />
            </div>
          </div>

          {/* Text Content Section */}
          <div className='md:col-span-7'>
            <header>
              <h1
                id='competition-hero-title'
                className='text-2xl font-extrabold uppercase tracking-wide text-sky-500 sm:text-3xl lg:text-4xl'
              >
                {t('title') || 'A Competição'}
              </h1>
            </header>

            <div className='prose prose-slate mt-6 max-w-none'>
              <div className='space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base lg:text-lg'>
                {t('p1') && <p>{parseBoldText(t('p1'))}</p>}
                {t('p2') && <p>{parseBoldText(t('p2'))}</p>}
                {t('p3') && <p>{parseBoldText(t('p3'))}</p>}
              </div>
            </div>

            {/* Buttons Section */}
            <div className='mt-8 flex flex-wrap gap-3'>
              {/* Regulations Button */}
              <button
                onClick={handleScrollToRegulations}
                className='group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-sky-700 hover:to-sky-800 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2'
                aria-describedby='cta-description'
              >
                <span>{t('cta') || 'Regulamento'}</span>
                <svg
                  className='h-4 w-4 transition-transform group-hover:translate-y-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 14l-7 7m0 0l-7-7m7 7V3'
                  />
                </svg>
              </button>

              {/* APP 2025 Button - Link Version */}
              <a
                href='https://volleyball-addict.com/tournament/1/3/'
                target='_blank'
                rel='noopener noreferrer'
                className='group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-sky-600 hover:to-sky-700 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2'
                aria-label='Open Cascais Volley Cup 2025 tournament app in new tab'
              >
                <span>APP 2025</span>
                <svg
                  className='h-4 w-4 transition-transform group-hover:-translate-y-0.5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                  />
                </svg>
              </a>

              <span id='cta-description' className='sr-only'>
                {t('ctaDescription') ||
                  'Scroll to view detailed competition rules and regulations'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mosaic Section with Responsive Images */}
      <MosaicStrip
        desktopSrc={ASSETS.MOSAIC}
        mobileSrc={ASSETS.MOSAIC_MOBILE}
        alt={
          t('mosaicAlt') ||
          'Photo mosaic showcasing competition highlights and participants'
        }
      />

      {/* Logo and Tagline Section - Below Mosaic - Desktop Only */}
      <LogoTaglineSection
        logoAlt={tLogo('logoAlt') || 'Cascais Volley Cup official logo'}
        taglineAlt={tLogo('taglineAlt') || 'Tournament tagline and subtitle'}
      />
    </section>
  )
}

// Extracted Mosaic component for better organization
function MosaicStrip({
  desktopSrc,
  mobileSrc,
  alt
}: {
  desktopSrc: string
  mobileSrc: string
  alt: string
}) {
  return (
    <>
      {/* Desktop/Tablet Mosaic */}
      <div className='mx-auto hidden w-full max-w-screen-2xl md:block'>
        <div className='relative h-[180px] w-full overflow-hidden lg:h-[220px]'>
          <Image
            src={desktopSrc}
            alt={alt}
            fill
            className='object-cover transition-opacity duration-300'
            sizes='100vw'
            quality={80}
            loading='lazy'
            draggable={false}
          />
        </div>
      </div>

      {/* Mobile Mosaic */}
      <div className='mx-auto block w-full max-w-screen-2xl md:hidden'>
        <div className='relative h-[140px] w-full overflow-hidden sm:h-[160px]'>
          <Image
            src={mobileSrc}
            alt={alt}
            fill
            className='object-cover transition-opacity duration-300'
            sizes='100vw'
            quality={80}
            loading='lazy'
            draggable={false}
          />
        </div>
      </div>
    </>
  )
}

// LogoTagline section with wave but no background image - Desktop Only
function LogoTaglineSection({
  logoAlt,
  taglineAlt
}: {
  logoAlt: string
  taglineAlt: string
}) {
  return (
    <div className='relative hidden lg:block'>
      {/* Wave Background */}
      <div className='relative overflow-hidden'>
        <Image
          src='/img/global/ondas-9.webp'
          alt=''
          width={2048}
          height={150}
          className='block h-[180px] w-full object-cover sm:h-[150px] lg:h-auto lg:object-contain'
          sizes='100vw'
          quality={75}
          loading='lazy'
          draggable={false}
          aria-hidden='true'
        />

        {/* Overlay Content */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8'>
            <div className='flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between sm:gap-8'>
              {/* Logo Section */}
              <div className='flex-shrink-0'>
                <Image
                  src={ASSETS.LOGO}
                  alt={logoAlt}
                  width={LOGO_DIMENSIONS.width}
                  height={LOGO_DIMENSIONS.height}
                  className='h-auto w-[180px] transition-transform duration-300 hover:scale-105 sm:w-[260px] lg:w-[320px] xl:w-[340px]'
                  sizes='(max-width: 640px) 180px, (max-width: 1024px) 260px, (max-width: 1280px) 320px, 340px'
                  quality={90}
                  loading='lazy'
                  draggable={false}
                />
              </div>

              {/* Tagline Section */}
              <div className='hidden flex-shrink-0 sm:block'>
                <Image
                  src={ASSETS.TAGLINE}
                  alt={taglineAlt}
                  width={TAGLINE_DIMENSIONS.width}
                  height={TAGLINE_DIMENSIONS.height}
                  className='h-auto w-[240px] transition-transform duration-300 hover:scale-105 sm:w-[280px] md:w-[300px] lg:w-[330px] xl:w-[360px]'
                  sizes='(max-width: 1024px) 280px, (max-width: 1280px) 330px, 360px'
                  quality={90}
                  loading='lazy'
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
