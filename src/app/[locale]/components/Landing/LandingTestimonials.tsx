// MOBILE-FIRST Optimized Testimonials - Smooth scrolling on mobile!
// src/app/[locale]/components/Landing/LandingTestimonials.tsx

'use client'

import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import clsx from 'clsx'

// ✅ MOBILE-FIRST optimized assets
const TESTIMONIALS_ASSETS = {
  waveTestimonials: '/img/global/ondas-9.webp',
  animations: {
    duration: 250 // ✅ Ultra fast for mobile
  },
  breakpoints: {
    tablet: '(min-width: 640px)', // ✅ Mobile-first breakpoints
    desktop: '(min-width: 1024px)'
  },
  spacing: {
    mobile: 8, // ✅ Minimal spacing for mobile
    tablet: 12,
    desktop: 16
  }
} as const

interface Testimonial {
  team: string
  quote: string
  country?: string
  year?: string
}

// ✅ Keep all 5 testimonials with original text content
const testimonials: Testimonial[] = [
  {
    team: 'SC Arcozelo',
    country: 'Portugal',
    year: '2025',
    quote: '"…mais uma vez o Sporting Clube de Arcozelo participou no torneio"'
  },
  {
    team: 'Pel Amora SC',
    country: 'Portugal',
    year: '2025',
    quote:
      '"…uma experiência inesquecível, tanto a nível competitivo como de convívio."'
  },
  {
    team: 'CRCD Luzense',
    country: 'Portugal',
    year: '2025',
    quote: '"…um torneio garantido pela organização e ambiente fantástico."'
  },
  {
    team: 'São Francisco AD',
    country: 'Portugal',
    year: '2025',
    quote: '"…as miúdas adoraram e claro que para o ano querem voltar."'
  },
  {
    team: 'CD Foz do Porto',
    country: 'Portugal',
    year: '2025',
    quote:
      '"...o torneio foi muito bem organizado, com espaço para crescermos enquanto equipa, não só a nível competitivo, mas também com momentos dedicados ao lazer."'
  }
]

interface LandingTestimonialsProps {
  isVisible: boolean
}

export default function LandingTestimonials({
  isVisible
}: LandingTestimonialsProps) {
  const t = useTranslations('LandingPage.Updates')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(true)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  // ✅ Detect mobile for optimizations
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // ✅ MOBILE-FIRST keen-slider configuration
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'snap', // ✅ Better for mobile touch
    defaultAnimation: { duration: TESTIMONIALS_ASSETS.animations.duration },
    slides: {
      perView: isMobile ? 1 : 1, // ✅ Always 1 on mobile
      spacing: TESTIMONIALS_ASSETS.spacing.mobile,
      origin: 'center' // ✅ Center slides on mobile
    },
    breakpoints: {
      [TESTIMONIALS_ASSETS.breakpoints.tablet]: {
        slides: { perView: 2, spacing: TESTIMONIALS_ASSETS.spacing.tablet }
      },
      [TESTIMONIALS_ASSETS.breakpoints.desktop]: {
        slides: { perView: 3, spacing: TESTIMONIALS_ASSETS.spacing.desktop } // ✅ 3 slides on desktop
      }
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel)
    },
    // ✅ Mobile-friendly autoplay
    created(s) {
      if (isVisible && !isMobile) {
        // ✅ No autoplay on mobile to save battery
        autoplayRef.current = setInterval(() => {
          s.next()
        }, 4000)
      }
    },
    destroyed() {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }
  })

  // ✅ Mobile-optimized navigation functions
  const goToSlide = useCallback(
    (index: number) => {
      instanceRef.current?.moveToIdx(index)
    },
    [instanceRef]
  )

  const goToPrevious = useCallback(() => {
    instanceRef.current?.prev()
  }, [instanceRef])

  const goToNext = useCallback(() => {
    instanceRef.current?.next()
  }, [instanceRef])

  // ✅ Memoized mobile-first testimonial cards
  const testimonialCards = useMemo(
    () =>
      testimonials.map((item, index) => (
        <div
          key={`${item.team}-${index}`}
          className='keen-slider__slide px-2 py-3 sm:py-4' // ✅ Smaller padding on mobile
        >
          <MobileFirstTestimonialCard testimonial={item} />
        </div>
      )),
    []
  )

  return (
    <>
      {/* ✅ MOBILE-FIRST Section Title */}
      <div className='mx-auto max-w-screen-xl px-4'>
        <div
          className={clsx(
            'transition-opacity duration-300', // ✅ Faster for mobile
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          <h3
            id='testimonials-heading'
            className='mb-2 mt-8 text-xl font-extrabold uppercase tracking-wide text-sky-500 sm:mb-3 sm:mt-12 sm:text-2xl lg:text-3xl' // ✅ Mobile-first sizing
          >
            {t('What_they_say') || 'WHAT THEY SAY'}
          </h3>
        </div>
      </div>

      {/* ✅ MOBILE-OPTIMIZED Wave section */}
      <div className='relative w-full overflow-hidden'>
        <div className='relative min-h-[240px] sm:min-h-[280px] lg:min-h-[320px]'>
          {' '}
          {/* ✅ Smaller on mobile */}
          {/* ✅ MOBILE-OPTIMIZED Wave background */}
          <Image
            src={TESTIMONIALS_ASSETS.waveTestimonials}
            alt=''
            role='presentation'
            fill
            className='object-cover'
            loading='lazy'
            quality={isMobile ? 60 : 70} // ✅ Even lower quality on mobile
            sizes='100vw'
          />
          {/* ✅ MOBILE-FIRST Testimonials overlay */}
          <div className='absolute inset-0 flex items-center text-white'>
            <div className='mx-auto w-full max-w-screen-xl px-2 sm:px-4'>
              {' '}
              {/* ✅ Less padding on mobile */}
              <div className='relative'>
                <div
                  ref={sliderRef}
                  className='keen-slider'
                  aria-labelledby='testimonials-heading'
                >
                  {testimonialCards}
                </div>

                {/* ✅ MOBILE-FIRST Navigation - dots only on mobile */}
                <div className='mt-3 flex items-center justify-center gap-3 sm:mt-4 sm:gap-4'>
                  {/* Navigation arrows - hidden on mobile to save space */}
                  <button
                    onClick={goToPrevious}
                    aria-label='Previous testimonial'
                    className='hidden rounded-full bg-white/25 p-1.5 transition-colors hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:block sm:p-2'
                  >
                    <FiChevronLeft className='h-3 w-3 sm:h-4 sm:w-4' />
                  </button>

                  {/* ✅ MOBILE-OPTIMIZED Dots navigation - larger touch targets */}
                  <div
                    className='flex gap-2'
                    role='tablist'
                    aria-label='Testimonial slides'
                  >
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        role='tab'
                        aria-selected={currentSlide === index}
                        className={clsx(
                          'h-3 w-3 rounded-full transition-colors sm:h-2 sm:w-2', // ✅ Larger on mobile for better touch
                          currentSlide === index
                            ? 'bg-white'
                            : 'bg-white/60 hover:bg-white/80'
                        )}
                      />
                    ))}
                  </div>

                  <button
                    onClick={goToNext}
                    aria-label='Next testimonial'
                    className='hidden rounded-full bg-white/25 p-1.5 transition-colors hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:block sm:p-2'
                  >
                    <FiChevronRight className='h-3 w-3 sm:h-4 sm:w-4' />
                  </button>
                </div>

                {/* ✅ DESKTOP-ONLY side arrows */}
                <div className='hidden lg:block'>
                  <button
                    onClick={goToPrevious}
                    aria-label='Previous testimonial'
                    className='absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 rounded-full bg-white/25 p-2 transition-colors hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
                  >
                    <FiChevronLeft className='h-5 w-5' />
                  </button>
                  <button
                    onClick={goToNext}
                    aria-label='Next testimonial'
                    className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-white/25 p-2 transition-colors hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
                  >
                    <FiChevronRight className='h-5 w-5' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ✅ MOBILE-FIRST Testimonial card component
const MobileFirstTestimonialCard: React.FC<{ testimonial: Testimonial }> =
  React.memo(({ testimonial: { team, quote, country, year } }) => {
    return (
      <div className='flex min-h-[100px] w-full flex-col items-center justify-center text-center text-white sm:min-h-[120px]'>
        {/* ✅ Mobile-optimized header */}
        <div className='mb-2 sm:mb-3'>
          <p className='text-base font-extrabold uppercase tracking-wide sm:text-lg'>
            {team}
          </p>
          {(country || year) && (
            <p className='mt-0.5 text-xs opacity-80 sm:mt-1'>
              {country && year ? `${country} · ${year}` : country || year}
            </p>
          )}
        </div>

        {/* ✅ Mobile-optimized quote */}
        <blockquote className='text-sm leading-snug sm:text-base sm:leading-relaxed'>
          {quote}
        </blockquote>
      </div>
    )
  })

MobileFirstTestimonialCard.displayName = 'MobileFirstTestimonialCard'
