// ULTRA-OPTIMIZED LandingUpdates - Final performance tweaks
// src/app/[locale]/components/Landing/LandingUpdates.tsx

'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import Image from 'next/image'
import LandingNews from './LandingNews'
import LandingTestimonials from './LandingTestimonials'

// ✅ Memoized shared assets to prevent object recreation
const SHARED_ASSETS = {
  background: '/img/landing/home-page-2.webp',
  waveTop: '/img/global/ondas-4.webp'
} as const

export default function LandingUpdates() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // ✅ Ultra-simplified intersection observer with better performance
  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect() // ✅ Disconnect after first trigger - no need to keep observing
        }
      },
      {
        threshold: 0.05 // ✅ Even earlier trigger for smoother experience
      }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // ✅ Memoized blur data URL to prevent recreation
  const blurDataURL = useMemo(
    () =>
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
    []
  )

  return (
    <section
      ref={sectionRef}
      className='relative isolate overflow-hidden pb-6 sm:pb-8'
      aria-labelledby='updates-section'
    >
      {/* ✅ ULTRA-OPTIMIZED Background */}
      <div className='absolute inset-0 -z-10'>
        <Image
          src={SHARED_ASSETS.background}
          alt=''
          role='presentation'
          fill
          loading='lazy'
          className='object-cover'
          quality={50} // ✅ Further reduced from 60 to 50 for background
          sizes='100vw'
          placeholder='blur'
          blurDataURL={blurDataURL}
          priority={false}
          decoding='async' // ✅ Async decoding for better performance
        />
      </div>

      {/* ✅ ULTRA-OPTIMIZED Top Wave */}
      <div className='absolute inset-x-0 top-0 z-0 h-[60px] sm:h-[80px] lg:h-[120px]'>
        <Image
          src={SHARED_ASSETS.waveTop}
          alt=''
          role='presentation'
          fill
          loading='lazy'
          className='object-cover object-center'
          quality={40} // ✅ Further reduced from 50 to 40 for decorative wave
          sizes='100vw'
          priority={false}
          decoding='async' // ✅ Async decoding
        />
      </div>

      {/* ✅ OPTIMIZED Content container */}
      <div className='relative z-10 pt-[60px] sm:pt-[80px] lg:pt-[120px]'>
        {' '}
        {/* ✅ Reduced padding to match wave height */}
        {/* News Section - Commented out but ready */}
        {/* <LandingNews isVisible={isVisible} /> */}
        {/* ✅ Testimonials Section - Only render when visible for performance */}
        {isVisible && <LandingTestimonials isVisible={isVisible} />}
      </div>
    </section>
  )
}
