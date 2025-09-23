// PRELOADED LandingUpdates - No intersection observer
// src/app/[locale]/components/Landing/LandingUpdates.tsx

'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import LandingTestimonials from './LandingTestimonials'

// Memoized shared assets
const SHARED_ASSETS = {
  background: '/img/landing/home-page-2.webp',
  waveTop: '/img/global/ondas-4.webp'
} as const

export default function LandingUpdates() {
  // Memoized blur data URL
  const blurDataURL = useMemo(
    () =>
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
    []
  )

  return (
    <section className='relative isolate overflow-hidden pb-6 sm:pb-8'>
      {/* Background - loads immediately */}
      <div className='absolute inset-0 -z-10'>
        <Image
          src={SHARED_ASSETS.background}
          alt=''
          fill
          priority={true} // ✅ Load immediately
          className='object-cover'
          quality={75} // ✅ Higher quality since we're preloading
          sizes='100vw'
          placeholder='blur'
          blurDataURL={blurDataURL}
        />
      </div>

      {/* Top Wave - loads immediately */}
      <div className='absolute inset-x-0 top-0 z-0 h-[60px] sm:h-[80px] lg:h-[120px]'>
        <Image
          src={SHARED_ASSETS.waveTop}
          alt=''
          fill
          priority={true} // ✅ Load immediately
          className='object-cover object-center'
          quality={70} // ✅ Higher quality since we're preloading
          sizes='100vw'
        />
      </div>

      {/* Content - no intersection observer, everything visible immediately */}
      <div className='relative z-10 pt-[60px] sm:pt-[80px] lg:pt-[120px]'>
        {/* Testimonials Section - always visible */}
        <LandingTestimonials isVisible={true} />
      </div>
    </section>
  )
}
