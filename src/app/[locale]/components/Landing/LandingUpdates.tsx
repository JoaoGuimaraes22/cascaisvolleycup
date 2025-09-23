// 1. Parent component with shared background
// src/app/[locale]/components/Landing/LandingUpdates.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import LandingNews from './LandingNews'
import LandingTestimonials from './LandingTestimonials'

// Shared assets
const SHARED_ASSETS = {
  background: '/img/landing/home-page-2.webp',
  waveTop: '/img/global/ondas-4.webp'
} as const

export default function LandingUpdates() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Simplified intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 } // Reduced threshold for earlier trigger
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className='relative isolate overflow-hidden pb-6 sm:pb-8'
      aria-labelledby='updates-section'
    >
      {/* Simplified Background - Let Next.js handle loading */}
      <div className='absolute inset-0 -z-10'>
        <Image
          src={SHARED_ASSETS.background}
          alt=''
          role='presentation'
          fill
          loading='lazy' // Changed from eager
          className='object-cover'
          quality={60} // Reduced quality for background
          sizes='100vw'
          placeholder='blur'
          blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
        />
      </div>

      {/* Simplified Top Wave */}
      <div className='absolute inset-x-0 top-0 z-0 h-[60px] sm:h-[80px] lg:h-[120px]'>
        <Image
          src={SHARED_ASSETS.waveTop}
          alt=''
          role='presentation'
          fill
          loading='lazy'
          className='object-cover object-center'
          quality={50} // Lower quality for decorative elements
          sizes='100vw'
        />
      </div>

      {/* Content loads immediately, no complex state management */}
      <div className='relative z-10 pt-[80px] sm:pt-[100px] lg:pt-[140px]'>
        {/* News Section */}
        {/* <LandingNews isVisible={isVisible} /> */}

        {/* Testimonials Section */}
        <LandingTestimonials isVisible={isVisible} />
      </div>
    </section>
  )
}
