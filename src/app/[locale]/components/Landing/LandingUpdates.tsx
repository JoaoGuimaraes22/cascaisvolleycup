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
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Intersection observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Preload critical images
  useEffect(() => {
    const criticalImages = [SHARED_ASSETS.background, SHARED_ASSETS.waveTop]

    Promise.all(
      criticalImages.map(
        src =>
          new Promise((resolve, reject) => {
            const img = new window.Image()
            img.onload = resolve
            img.onerror = reject
            img.src = src
          })
      )
    )
      .then(() => {
        setImagesLoaded(true)
      })
      .catch(() => {
        // Still show content even if preload fails
        setImagesLoaded(true)
      })
  }, [])

  return (
    <section
      ref={sectionRef}
      className='relative isolate overflow-hidden pb-6 sm:pb-8'
      aria-labelledby='updates-section'
    >
      {/* Shared Background */}
      <SharedBackground imagesLoaded={imagesLoaded} />

      {/* Top Wave */}
      <TopWave />

      {/* Content wrapper with responsive padding */}
      <div className='relative z-10 pt-[80px] sm:pt-[100px] lg:pt-[140px]'>
        {/* News Section */}
        <LandingNews isVisible={isVisible} />

        {/* Testimonials Section */}
        <LandingTestimonials isVisible={isVisible} />
      </div>
    </section>
  )
}

// Shared background component
function SharedBackground({ imagesLoaded }: { imagesLoaded: boolean }) {
  return (
    <div
      className={`absolute inset-0 -z-10 transition-opacity duration-500 ${
        imagesLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Image
        src={SHARED_ASSETS.background}
        alt=''
        role='presentation'
        fill
        priority={false}
        className='object-cover'
        quality={60}
        sizes='100vw'
        placeholder='blur'
        blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
      />
    </div>
  )
}

// Top wave component
function TopWave() {
  return (
    <div className='absolute inset-x-0 top-0 z-0 h-[60px] sm:h-[80px] lg:h-[120px]'>
      <Image
        src={SHARED_ASSETS.waveTop}
        alt=''
        role='presentation'
        fill
        className='object-cover object-center'
        quality={60}
        priority={false}
        sizes='100vw'
      />
    </div>
  )
}

// =============================================================================
