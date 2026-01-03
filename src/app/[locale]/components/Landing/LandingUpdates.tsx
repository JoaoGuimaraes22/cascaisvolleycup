// Optimized LandingUpdates - Intersection Observer for performance
// src/app/[locale]/components/Landing/LandingUpdates.tsx

'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import LandingTestimonials from './LandingTestimonials'

// Memoized shared assets
const SHARED_ASSETS = {
  background: '/img/landing/home-page-2.webp',
  waveTop: '/img/global/ondas-4.webp'
} as const

export default function LandingUpdates() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // ✅ ADD: Intersection Observer to only load when section becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect() // Stop observing once visible
          }
        })
      },
      {
        rootMargin: '200px', // Start loading 200px before section is visible
        threshold: 0.1
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className='relative isolate overflow-hidden bg-white pb-6 sm:pb-8'
    >
      {/* ✅ OPTIMIZED: Only render images when section is visible */}
      {isVisible && (
        <>
          {/* Background - Lazy load (below fold) */}
          <div className='absolute inset-0 -z-10 bg-white'>
            <Image
              src={SHARED_ASSETS.background}
              alt=''
              fill
              priority={false}
              className='bg-white object-cover'
              quality={70}
              sizes='100vw'
              // ✅ REMOVED: loading='lazy' - Next.js handles this automatically
            />
          </div>

          {/* Top Wave - Lazy load */}
          <div className='absolute inset-x-0 top-0 z-0 h-[60px] sm:h-[80px] lg:h-[120px]'>
            <Image
              src={SHARED_ASSETS.waveTop}
              alt=''
              fill
              priority={false}
              className='object-cover object-center'
              quality={65}
              sizes='100vw'
              // ✅ REMOVED: loading='lazy'
            />
          </div>
        </>
      )}

      {/* Content */}
      <div className='relative z-10 pt-[60px] sm:pt-[80px] lg:pt-[120px]'>
        {/* Testimonials Section */}
        <LandingTestimonials isVisible={isVisible} />
      </div>
    </section>
  )
}
