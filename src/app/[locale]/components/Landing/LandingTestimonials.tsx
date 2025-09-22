// 3. Testimonials Section Component
// src/app/[locale]/components/Landing/LandingTestimonials.tsx

'use client'

import { useCallback, useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import clsx from 'clsx'

// Testimonials-specific assets
const TESTIMONIALS_ASSETS = {
  waveTestimonials: '/img/global/ondas-9.webp',
  animations: {
    duration: 600 // Reduced from 800 to match AboutPortugal
  },
  breakpoints: {
    mobile: '(min-width: 768px)',
    desktop: '(min-width: 1024px)'
  },
  spacing: {
    mobile: 16,
    tablet: 20,
    desktop: 24
  }
} as const

interface Testimonial {
  team: string
  quote: string
  country?: string
  year?: string
}

// Fixed testimonials data - removed duplicates
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

  // Testimonials slider - same configuration as AboutPortugal but with loop
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true, // Keep loop enabled
    defaultAnimation: { duration: TESTIMONIALS_ASSETS.animations.duration },
    slides: {
      perView: 1,
      spacing: TESTIMONIALS_ASSETS.spacing.mobile
    },
    breakpoints: {
      [TESTIMONIALS_ASSETS.breakpoints.mobile]: {
        slides: { perView: 2, spacing: TESTIMONIALS_ASSETS.spacing.tablet }
      },
      [TESTIMONIALS_ASSETS.breakpoints.desktop]: {
        slides: { perView: 4, spacing: TESTIMONIALS_ASSETS.spacing.desktop }
      }
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel)
    }
  })

  // Navigation functions - same pattern as AboutPortugal (no auto-play logic)
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

  return (
    <>
      {/* Section Title */}
      <div className='mx-auto max-w-screen-xl px-4'>
        <div
          className={clsx(
            'delay-[600ms] transition-all duration-1000 ease-out',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <h3
            id='testimonials-heading'
            className='mb-3 mt-12 text-2xl font-extrabold uppercase tracking-wide text-sky-500 sm:mb-4 sm:mt-16 sm:text-3xl'
          >
            {t('What_they_say') || 'WHAT THEY SAY'}
          </h3>
        </div>
      </div>

      {/* Full-bleed wave band with testimonials */}
      <div className='relative left-1/2 w-screen -translate-x-1/2'>
        <div className='relative min-h-[50vh] sm:min-h-[360px]'>
          {/* Wave background */}
          <Image
            src={TESTIMONIALS_ASSETS.waveTestimonials}
            alt=''
            role='presentation'
            fill
            className='object-cover'
            priority={false}
            quality={60}
            sizes='100vw'
          />

          {/* Testimonials overlay */}
          <div className='absolute inset-0 flex items-center text-white'>
            <div className='mx-auto w-full max-w-screen-xl px-4'>
              {/* Slider with controls */}
              <div className='relative'>
                <div
                  ref={sliderRef}
                  className='keen-slider'
                  aria-labelledby='testimonials-heading'
                >
                  {testimonials.map((item, index) => (
                    <div
                      key={`${item.team}-${index}`}
                      className='keen-slider__slide min-h-[180px] px-2 py-6 lg:px-4'
                    >
                      <TestimonialCard {...item} />
                    </div>
                  ))}
                </div>

                {/* Navigation arrows (desktop only) */}
                <div className='hidden lg:block'>
                  <button
                    onClick={goToPrevious}
                    aria-label={
                      t('previousTestimonial') || 'Previous testimonial'
                    }
                    className='absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
                  >
                    <FiChevronLeft className='h-6 w-6' />
                  </button>
                  <button
                    onClick={goToNext}
                    aria-label={t('nextTestimonial') || 'Next testimonial'}
                    className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
                  >
                    <FiChevronRight className='h-6 w-6' />
                  </button>
                </div>

                {/* Controls - Simplified like AboutPortugal */}
                <div className='mt-6 flex items-center justify-center gap-4'>
                  {/* Navigation arrows (mobile/tablet) */}
                  <button
                    onClick={goToPrevious}
                    aria-label={
                      t('previousTestimonial') || 'Previous testimonial'
                    }
                    className='rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
                  >
                    <FiChevronLeft className='h-4 w-4' />
                  </button>

                  {/* Dots */}
                  <div
                    className='flex gap-2'
                    role='tablist'
                    aria-label='Testimonial slides'
                  >
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        aria-label={`${t('goToSlide') || 'Go to slide'} ${index + 1}`}
                        role='tab'
                        aria-selected={currentSlide === index}
                        className={clsx(
                          'h-2 w-2 rounded-full transition-all',
                          currentSlide === index
                            ? 'scale-125 bg-white'
                            : 'bg-white/50 hover:bg-white/80'
                        )}
                      />
                    ))}
                  </div>

                  <button
                    onClick={goToNext}
                    aria-label={t('nextTestimonial') || 'Next testimonial'}
                    className='rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
                  >
                    <FiChevronRight className='h-4 w-4' />
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

// Testimonial card component
const TestimonialCard: React.FC<Testimonial> = ({
  team,
  quote,
  country,
  year
}) => {
  return (
    <div className='flex min-h-[140px] w-full flex-col items-center justify-center text-center text-white lg:min-h-[160px]'>
      <div className='mb-3'>
        <p className='text-lg font-extrabold uppercase tracking-wide drop-shadow'>
          {team}
        </p>
        {(country || year) && (
          <p className='mt-1 text-xs opacity-80'>
            {country && year ? `${country} · ${year}` : country || year}
          </p>
        )}
      </div>
      <blockquote className='text-sm leading-relaxed drop-shadow-sm sm:text-base lg:text-lg'>
        {quote}
      </blockquote>
    </div>
  )
}
