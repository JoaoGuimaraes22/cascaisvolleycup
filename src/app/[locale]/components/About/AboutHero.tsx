'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { FiExternalLink, FiArrowRight } from 'react-icons/fi'
import clsx from 'clsx'

// Types
interface SponsorLogo {
  src: string
  alt: string
  w: number
  h: number
  id: string
}

interface ClubInfo {
  src: string
  alt: string
  w: number
  h: number
  url: string
}

export default function AboutHero() {
  const t = useTranslations('AboutPage.Hero')
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Constants for better maintainability
  const ASSETS = {
    background: '/img/about/about-bg.webp',
    hero: '/img/about/about-hero.webp',
    club: '/img/sponsors/volley4all.webp'
  } as const

  const SPONSOR_LOGOS: SponsorLogo[] = [
    {
      id: 'cascais-estoril',
      src: '/img/sponsors/cascais-estoril.webp',
      alt: t('sponsors.cascaisEstorilAlt'),
      w: 140,
      h: 56
    },
    {
      id: 'camara',
      src: '/img/sponsors/cascais-camara.webp',
      alt: t('sponsors.camaraAlt'),
      w: 160,
      h: 56
    },
    {
      id: 'cam-ford',
      src: '/img/sponsors/cam-ford.webp',
      alt: t('sponsors.camFordAlt'),
      w: 150,
      h: 56
    },
    {
      id: 'fpv',
      src: '/img/sponsors/fpv.webp',
      alt: t('sponsors.fpvAlt'),
      w: 140,
      h: 56
    }
  ]

  const CLUB_INFO: ClubInfo = {
    src: ASSETS.club,
    alt: t('club.logoAlt'),
    w: 260,
    h: 70,
    url: 'https://volley4all.com'
  }

  const PARAGRAPHS = ['p1', 'p2', 'p3'] as const

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

  const handleCtaClick = () => {
    // Handle CTA click if needed
  }

  return (
    <section
      ref={sectionRef}
      className='relative min-h-[100vh] w-full overflow-x-hidden md:h-[calc(100vh-80px)] md:overflow-hidden'
      aria-labelledby='about-hero-title'
    >
      {/* Enhanced Background with Loading State */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100' />
        <Image
          src={ASSETS.background}
          alt=''
          role='presentation'
          fill
          className={clsx(
            'object-cover transition-opacity duration-700',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          sizes='100vw'
          priority
          onLoad={() => setImageLoaded(true)}
          quality={75}
        />
      </div>

      {/* Right Hero Image Panel - Hidden on Mobile */}
      <div className='absolute inset-y-0 right-0 z-0 hidden w-[34vw] md:block'>
        <div className='absolute inset-0 bg-gradient-to-l from-transparent to-white/20' />
        <Image
          src={ASSETS.hero}
          alt={
            t('heroImageAlt') ||
            'Volleyball players in action at Cascais tournament'
          }
          fill
          quality={80}
          className='object-cover object-top'
          sizes='(max-width: 768px) 0px, 34vw'
          priority
        />
      </div>

      {/* Main Content Container */}
      <div className='relative z-10 mx-auto h-full max-w-screen-xl px-4 pb-8 pt-20 md:pb-20 md:pr-[34vw]'>
        <div className='space-y-6'>
          {/* Animated Title */}
          <div
            className={clsx(
              'transition-all duration-1000 ease-out',
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
          >
            <h1
              id='about-hero-title'
              className='text-3xl font-extrabold uppercase text-sky-500 md:text-4xl lg:text-5xl'
            >
              {t('title')}
            </h1>
          </div>

          {/* Animated Paragraphs with Staggered Delays */}
          <div className='space-y-4'>
            {PARAGRAPHS.map((key, index) => (
              <div
                key={key}
                className={clsx(
                  'transition-all duration-700 ease-out',
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                )}
                style={{
                  transitionDelay: `${(index + 1) * 200}ms`
                }}
              >
                <p className='max-w-prose text-sm leading-relaxed text-slate-700 sm:text-base lg:text-lg'>
                  {t(key)}
                </p>
              </div>
            ))}
            <p>
              {t('p4')} <strong>{t('p4Bold')} </strong> {t('p4Rest')}
            </p>
          </div>

          {/* Mobile Layout: New arrangement */}
          <div className='md:hidden'>
            <div
              className={clsx(
                'mx-auto w-full max-w-[360px] transition-all duration-1000 ease-out',
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              )}
              style={{ transitionDelay: '1000ms' }}
            >
              {/* First row: cam-ford, fpv, cascais-camara */}
              <div className='mb-3 grid grid-cols-3 gap-1'>
                <LogoCard
                  key='cam-ford-mobile'
                  logo={SPONSOR_LOGOS.find(s => s.id === 'cam-ford')!}
                  index={0}
                  mobile
                />
                <LogoCard
                  key='fpv-mobile'
                  logo={SPONSOR_LOGOS.find(s => s.id === 'fpv')!}
                  index={1}
                  mobile
                />
                <LogoCard
                  key='camara-mobile'
                  logo={SPONSOR_LOGOS.find(s => s.id === 'camara')!}
                  index={2}
                  mobile
                />
              </div>

              {/* Second row: cascais-estoril, volley4all */}
              <div className='grid grid-cols-2 gap-2'>
                <LogoCard
                  key='cascais-estoril-mobile'
                  logo={SPONSOR_LOGOS.find(s => s.id === 'cascais-estoril')!}
                  index={3}
                  mobile
                />
                <LogoCard
                  key='volley4all-mobile'
                  logo={CLUB_INFO}
                  index={4}
                  mobile
                />
              </div>

              {/* Centered CTA Button */}
              <div className='mt-6 flex justify-center'>
                <CtaButton href={CLUB_INFO.url} onClick={handleCtaClick} mobile>
                  {t('cta')}
                </CtaButton>
              </div>
            </div>
          </div>

          {/* Desktop Layout: Inline sponsors + right-aligned CTA */}
          <div className='hidden md:block'>
            <div
              className={clsx(
                'transition-all duration-1000 ease-out',
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              )}
              style={{ transitionDelay: '1000ms' }}
            >
              {/* Sponsors in one line */}
              <div className='flex flex-wrap items-center justify-center gap-6 lg:justify-start lg:gap-8'>
                {SPONSOR_LOGOS.map((logo, index) => (
                  <LogoCard key={logo.id} logo={logo} index={index} />
                ))}
                <LogoCard logo={CLUB_INFO} index={SPONSOR_LOGOS.length} />
              </div>

              {/* Right-aligned CTA Button */}
              <div className='mt-6 flex justify-end'>
                <CtaButton href={CLUB_INFO.url} onClick={handleCtaClick}>
                  {t('cta')}
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------- Enhanced Sub-Components -------- */

interface LogoCardProps {
  logo: SponsorLogo | ClubInfo
  index: number
  mobile?: boolean
}

function LogoCard({ logo, index, mobile = false }: LogoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div
      className={clsx(
        'group flex items-center justify-center transition-all duration-300',
        mobile ? 'min-h-[60px]' : 'min-h-[80px]'
      )}
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className='absolute inset-0 animate-pulse rounded-lg bg-slate-200/30' />
      )}

      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.w}
        height={logo.h}
        className={clsx(
          'w-auto object-contain transition-all duration-300 group-hover:scale-105',
          mobile ? 'h-10 sm:h-12' : 'h-12 lg:h-14',
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
        loading='eager'
        decoding='async'
        quality={80}
        sizes={
          mobile
            ? '(max-width: 640px) 25vw, 120px'
            : '(max-width: 1024px) 140px, 160px'
        }
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  )
}

interface CtaButtonProps {
  href: string
  onClick: () => void
  children: React.ReactNode
  mobile?: boolean
}

function CtaButton({
  href,
  onClick,
  children,
  mobile = false
}: CtaButtonProps) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      onClick={onClick}
      className={clsx(
        'group relative overflow-hidden rounded-lg font-bold text-white shadow-lg ring-1 ring-black/10 transition-all duration-300',
        'bg-gradient-to-r from-sky-600 to-sky-700',
        'hover:scale-105 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300',
        'inline-flex items-center gap-2',
        mobile ? 'px-6 py-3 text-sm' : 'px-6 py-3 text-sm lg:text-base'
      )}
    >
      <span className='relative z-10 flex items-center justify-center gap-2'>
        {children}
        {mobile ? (
          <FiExternalLink className='h-4 w-4' />
        ) : (
          <FiArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
        )}
      </span>

      {/* Shimmer effect */}
      <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full' />
    </a>
  )
}

// Extend global Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
