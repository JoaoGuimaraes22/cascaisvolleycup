'use client'

import React, { useMemo } from 'react'
import { useIsClient } from '../../_hooks/use-is-client'
import { useSnapCarousel } from '../../_hooks/use-snap-carousel'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'
import clsx from 'clsx'

const TESTIMONIALS_ASSETS = {
  waveTestimonials: '/img/global/ondas-9.webp'
} as const

interface Testimonial {
  team: string
  quote: string
  country?: string
  year?: string
}

const TESTIMONIAL_KEYS = ['t1', 't2', 't3', 't4', 't5'] as const

type TestimonialItem = {
  team: string
  country: string
  year: string
  quote: string
}

type TestimonialsDict = {
  heading: string
  items: Record<(typeof TESTIMONIAL_KEYS)[number], TestimonialItem>
}

const StarRating = React.memo(() => {
  return (
    <div
      className='mt-3 flex items-center justify-center gap-1'
      aria-label='5 star rating'
    >
      {[...Array(5)].map((_, index) => (
        <FiStar
          key={index}
          className='h-4 w-4 fill-yellow-400 text-yellow-400 sm:h-5 sm:w-5'
          aria-hidden='true'
        />
      ))}
    </div>
  )
})

StarRating.displayName = 'StarRating'

const TestimonialCard = React.memo(
  ({ testimonial }: { testimonial: Testimonial }) => {
    const { team, quote, country, year } = testimonial

    return (
      <div className='flex min-h-[160px] w-full flex-col items-center justify-center text-center text-white sm:min-h-[140px]'>
        <div className='mb-2 sm:mb-3'>
          <p className='text-base font-extrabold tracking-wide uppercase sm:text-lg'>
            {team}
          </p>
          {(country || year) && (
            <p className='mt-0.5 text-xs opacity-80 sm:mt-1'>
              {country && year ? `${country} · ${year}` : country || year}
            </p>
          )}
        </div>

        <blockquote className='px-4 text-sm leading-snug sm:text-base sm:leading-relaxed'>
          {quote}
        </blockquote>

        <StarRating />
      </div>
    )
  }
)

TestimonialCard.displayName = 'TestimonialCard'

interface LandingTestimonialsProps {
  dict: TestimonialsDict
}

export default function LandingTestimonials({
  dict
}: LandingTestimonialsProps) {
  const isMounted = useIsClient()

  const testimonials: Testimonial[] = useMemo(
    () =>
      TESTIMONIAL_KEYS.map(key => ({
        team: dict.items[key].team,
        country: dict.items[key].country,
        year: dict.items[key].year,
        quote: dict.items[key].quote
      })),
    [dict]
  )

  const { scrollRef, activeIndex, goToSlide, next, prev } = useSnapCarousel({
    slideCount: testimonials.length,
    loop: true
  })

  const mobileTestimonials = useMemo(
    () => testimonials.slice(0, 3),
    [testimonials]
  )

  return (
    <>
      <div className='mx-auto max-w-screen-xl px-4'>
        <div>
          <h3
            id='testimonials-heading'
            className='mt-8 mb-2 text-xl font-extrabold tracking-wide text-sky-500 uppercase sm:mt-12 sm:mb-3 sm:text-2xl lg:text-3xl'
          >
            {dict.heading}
          </h3>
        </div>
      </div>

      <div className='relative w-full overflow-hidden'>
        <div className='relative min-h-[600px] sm:min-h-[280px] lg:min-h-[320px]'>
          <Image
            src={TESTIMONIALS_ASSETS.waveTestimonials}
            alt=''
            role='presentation'
            fill
            className='object-cover'
            priority={false}
            unoptimized
            sizes='100vw'
          />

          <div className='absolute inset-0 flex items-center text-white'>
            <div className='mx-auto w-full max-w-screen-xl px-2 sm:px-4'>
              {/* Mobile: Stacked testimonials */}
              <div className='space-y-6 py-6 sm:hidden'>
                {mobileTestimonials.map((testimonial, index) => (
                  <div
                    key={`mobile-${testimonial.team}-${index}`}
                    className='px-4'
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>

              {/* Tablet+: Auto-rotating snap carousel */}
              {isMounted && (
                <div className='relative hidden sm:block'>
                  <div
                    ref={scrollRef}
                    className='scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto py-3 sm:py-4 lg:gap-4'
                    aria-labelledby='testimonials-heading'
                  >
                    {testimonials.map((item, index) => (
                      <div
                        key={`${item.team}-${index}`}
                        className='shrink-0 snap-center basis-[calc(50%-0.375rem)] px-2 lg:basis-[calc(33.3333%-0.6667rem)]'
                      >
                        <TestimonialCard testimonial={item} />
                      </div>
                    ))}
                  </div>

                  <div className='mt-3 flex items-center justify-center gap-3 sm:mt-4 sm:gap-4'>
                    <button
                      onClick={prev}
                      aria-label='Previous testimonial'
                      className='rounded-full bg-white/25 p-1.5 hover:bg-white/35 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none motion-safe:transition-colors sm:p-2'
                    >
                      <FiChevronLeft className='h-3 w-3 sm:h-4 sm:w-4' />
                    </button>

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
                          aria-selected={activeIndex === index}
                          className={clsx(
                            'h-3 w-3 rounded-full motion-safe:transition-colors sm:h-2 sm:w-2',
                            activeIndex === index
                              ? 'bg-white'
                              : 'bg-white/60 hover:bg-white/80'
                          )}
                        />
                      ))}
                    </div>

                    <button
                      onClick={next}
                      aria-label='Next testimonial'
                      className='rounded-full bg-white/25 p-1.5 hover:bg-white/35 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none motion-safe:transition-colors sm:p-2'
                    >
                      <FiChevronRight className='h-3 w-3 sm:h-4 sm:w-4' />
                    </button>
                  </div>

                  <div className='hidden lg:block'>
                    <button
                      onClick={prev}
                      aria-label='Previous testimonial'
                      className='absolute top-1/2 left-0 -translate-x-4 -translate-y-1/2 rounded-full bg-white/25 p-2 hover:bg-white/35 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none motion-safe:transition-colors'
                    >
                      <FiChevronLeft className='h-5 w-5' />
                    </button>
                    <button
                      onClick={next}
                      aria-label='Next testimonial'
                      className='absolute top-1/2 right-0 translate-x-4 -translate-y-1/2 rounded-full bg-white/25 p-2 hover:bg-white/35 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none motion-safe:transition-colors'
                    >
                      <FiChevronRight className='h-5 w-5' />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
