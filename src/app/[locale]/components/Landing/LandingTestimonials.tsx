// PRELOADED LandingTestimonials - No intersection observer, always visible
// src/app/[locale]/components/Landing/LandingTestimonials.tsx

'use client'

import React, { useCallback, useState, useMemo, useRef } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import clsx from 'clsx'

// ✅ Optimized testimonials assets
const TESTIMONIALS_ASSETS = {
  waveTestimonials: '/img/global/ondas-9.webp',
  animations: {
    duration: 250 // ✅ Fast transitions
  },
  breakpoints: {
    tablet: '(min-width: 640px)',
    desktop: '(min-width: 1024px)'
  },
  spacing: {
    mobile: 8,
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

// ✅ All testimonials data
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
  isVisible: boolean // Keep interface but always treat as true
}

export default function LandingTestimonials({
  isVisible = true // ✅ Always visible in preloaded version
}: LandingTestimonialsProps) {
  const t = useTranslations('LandingPage.Updates')
  const [currentSlide, setCurrentSlide] = useState(0)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  // ✅ Optimized keen-slider configuration
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'snap',
    defaultAnimation: { duration: TESTIMONIALS_ASSETS.animations.duration },
    slides: {
      perView: 1,
      spacing: TESTIMONIALS_ASSETS.spacing.mobile,
      origin: 'center'
    },
    breakpoints: {
      [TESTIMONIALS_ASSETS.breakpoints.tablet]: {
        slides: { perView: 2, spacing: TESTIMONIALS_ASSETS.spacing.tablet }
      },
      [TESTIMONIALS_ASSETS.breakpoints.desktop]: {
        slides: { perView: 3, spacing: TESTIMONIALS_ASSETS.spacing.desktop }
      }
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel)
    },
    // ✅ Autoplay starts immediately
    created(s) {
      autoplayRef.current = setInterval(() => {
        s.next()
      }, 4000)
    },
    destroyed() {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }
  })

  // ✅ Navigation functions
  const goToSlide = useCallback(
    (index: number) => instanceRef.current?.moveToIdx(index),
    [instanceRef]
  )

  const goToPrevious = useCallback(() => {
    instanceRef.current?.prev()
  }, [instanceRef])

  const goToNext = useCallback(() => {
    instanceRef.current?.next()
  }, [instanceRef])

  // ✅ Memoized testimonial cards
  const testimonialCards = useMemo(
    () =>
      testimonials.map((item, index) => (
        <div
          key={`${item.team}-${index}`}
          className='keen-slider__slide px-2 py-3 sm:py-4'
        >
          <PreloadedTestimonialCard testimonial={item} />
        </div>
      )),
    []
  )

  return (
    <>
      {/* ✅ Section Title - immediately visible */}
      <div className='mx-auto max-w-screen-xl px-4'>
        <div>
          <h3
            id='testimonials-heading'
            className='mb-2 mt-8 text-xl font-extrabold uppercase tracking-wide text-sky-500 sm:mb-3 sm:mt-12 sm:text-2xl lg:text-3xl'
          >
            {t('What_they_say') || 'WHAT THEY SAY'}
          </h3>
        </div>
      </div>

      {/* ✅ Wave section - preloaded */}
      <div className='relative w-full overflow-hidden'>
        <div className='relative min-h-[240px] sm:min-h-[280px] lg:min-h-[320px]'>
          {/* ✅ Wave background - preload immediately */}
          <Image
            src={TESTIMONIALS_ASSETS.waveTestimonials}
            alt=''
            role='presentation'
            fill
            className='object-cover'
            priority={true} // ✅ Preload wave background
            quality={60}
            sizes='100vw'
          />

          {/* ✅ Testimonials overlay - immediately visible */}
          <div className='absolute inset-0 flex items-center text-white'>
            <div className='mx-auto w-full max-w-screen-xl px-2 sm:px-4'>
              <div className='relative'>
                <div
                  ref={sliderRef}
                  className='keen-slider'
                  aria-labelledby='testimonials-heading'
                >
                  {testimonialCards}
                </div>

                {/* ✅ Navigation */}
                <div className='mt-3 flex items-center justify-center gap-3 sm:mt-4 sm:gap-4'>
                  <button
                    onClick={goToPrevious}
                    aria-label='Previous testimonial'
                    className='hidden rounded-full bg-white/25 p-1.5 transition-colors hover:bg-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:block sm:p-2'
                  >
                    <FiChevronLeft className='h-3 w-3 sm:h-4 sm:w-4' />
                  </button>

                  {/* Dots navigation */}
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
                          'h-3 w-3 rounded-full transition-colors sm:h-2 sm:w-2',
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

                {/* Desktop-only side arrows */}
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

// ✅ Preloaded testimonial card component
const PreloadedTestimonialCard: React.FC<{ testimonial: Testimonial }> =
  React.memo(({ testimonial: { team, quote, country, year } }) => {
    return (
      <div className='flex min-h-[100px] w-full flex-col items-center justify-center text-center text-white sm:min-h-[120px]'>
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

        <blockquote className='text-sm leading-snug sm:text-base sm:leading-relaxed'>
          {quote}
        </blockquote>
      </div>
    )
  })

PreloadedTestimonialCard.displayName = 'PreloadedTestimonialCard'
