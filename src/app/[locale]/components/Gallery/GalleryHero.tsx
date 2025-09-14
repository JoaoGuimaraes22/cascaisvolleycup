// Updated GalleryHero component to use static routes instead of dynamic ones
// src/app/[locale]/components/Gallery/GalleryHero.tsx

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/src/navigation'
import { FiImage, FiArrowRight, FiWifiOff } from 'react-icons/fi'
import clsx from 'clsx'

// Import our optimized components
import {
  useOptimizedGallery,
  ProcessedImage
} from '@/src/hooks/useOptimizedGallery'
import OptimizedCloudinaryImage from './OptimizedCloudinaryImage'

// Assets constant for better maintainability
const ASSETS = {
  background: '/img/gallery/hero-bg.webp',
  tagline: '/img/global/tagline-w.webp'
} as const

const IMAGES_PER_YEAR = 6

// Map years to static routes - this is the key change!
const YEAR_ROUTES = {
  2025: '/gallery/2025',
  2024: '/gallery/2024',
  2023: '/gallery/2023'
} as const

// Custom hook for intersection observer with staggered animations
function useStaggeredAnimation(threshold = 0.2) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold, rootMargin: '50px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { isVisible, sectionRef }
}

// Loading skeleton component for year cards
function YearCardSkeleton() {
  return (
    <div className='h-full rounded-2xl bg-white/10 p-6 backdrop-blur-sm'>
      <div className='flex h-full flex-col'>
        {/* Header skeleton */}
        <div className='mb-6 flex items-center justify-between'>
          <div className='h-8 w-16 animate-pulse rounded bg-white/20' />
          <div className='h-8 w-20 animate-pulse rounded-full bg-white/20' />
        </div>

        {/* Images grid skeleton */}
        <div className='mb-4 grid flex-1 grid-cols-3 gap-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='aspect-square animate-pulse rounded-lg bg-white/20'
              style={{
                animationDelay: `${index * 100}ms`
              }}
            />
          ))}
        </div>

        {/* Footer skeleton */}
        <div className='mx-auto h-4 w-32 animate-pulse rounded bg-white/20' />
      </div>
    </div>
  )
}

// Compact image grid for each year
interface CompactImageGridProps {
  images: ProcessedImage[]
  year: number
  altTextPrefix: string
  isVisible: boolean
  onImageClick?: (image: ProcessedImage) => void
}

function CompactImageGrid({
  images,
  year,
  altTextPrefix,
  isVisible,
  onImageClick
}: CompactImageGridProps) {
  return (
    <div className='grid flex-1 grid-cols-3 gap-2 sm:gap-3'>
      {images.slice(0, IMAGES_PER_YEAR).map((img, index) => (
        <div
          key={img.public_id}
          className={clsx(
            'group relative aspect-square overflow-hidden rounded-lg ring-1 ring-white/20 transition-all duration-500 ease-out',
            'hover:-translate-y-1 hover:shadow-lg hover:shadow-black/25 hover:ring-2 hover:ring-white/50',
            onImageClick && 'cursor-pointer',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}
          style={{
            transitionDelay: `${400 + index * 50}ms`
          }}
          onClick={() => onImageClick?.(img)}
        >
          <OptimizedCloudinaryImage
            publicId={img.public_id}
            alt={`${altTextPrefix} ${year} - ${img.public_id.split('/').pop()}`}
            width={200}
            height={200}
            quality={60}
            className='h-full w-full object-cover transition-all duration-500 group-hover:scale-110'
            loading='lazy'
            sizes='(max-width: 768px) 33vw, (max-width: 1024px) 16vw, 12vw'
            crop='fill'
            gravity='auto'
          />

          {/* Hover overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

          {/* Image indicator icon */}
          <div className='absolute bottom-1 right-1 rounded-full bg-white/90 p-1 opacity-0 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:opacity-100'>
            <FiImage className='h-2.5 w-2.5 text-sky-600' />
          </div>
        </div>
      ))}
    </div>
  )
}

// Removed status indicator component

// Enhanced year card component for single viewport
interface YearCardProps {
  year: number
  images: ProcessedImage[]
  loading: boolean
  error: string | null
  locale: string
  t: (key: string) => string
  isVisible: boolean
  cardIndex: number
  onImageClick?: (image: ProcessedImage) => void
}

// Updated YearCard component without image count
function YearCard({
  year,
  images,
  loading,
  error,
  locale,
  t,
  isVisible,
  cardIndex,
  onImageClick
}: YearCardProps) {
  const renderContent = () => {
    if (error) {
      return (
        <div className='flex flex-1 items-center justify-center'>
          <div className='space-y-3 text-center'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20'>
              <FiWifiOff className='h-5 w-5 text-red-300' />
            </div>
            <p className='text-sm text-white/80'>Failed to load</p>
          </div>
        </div>
      )
    }

    if (!images.length) {
      return (
        <div className='flex flex-1 items-center justify-center'>
          <div className='space-y-2 text-center'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10'>
              <FiImage className='h-5 w-5 text-white/60' />
            </div>
            <p className='text-sm text-white/60'>No images</p>
          </div>
        </div>
      )
    }

    return (
      <CompactImageGrid
        images={images}
        year={year}
        altTextPrefix={t('gallery_image') || 'Gallery image'}
        isVisible={isVisible}
        onImageClick={onImageClick}
      />
    )
  }

  // Get static route for this year
  const yearRoute = YEAR_ROUTES[year as keyof typeof YEAR_ROUTES]

  return (
    <div
      className={clsx(
        'w-full transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      )}
      style={{
        transitionDelay: `${200 + cardIndex * 150}ms`
      }}
    >
      <div className='flex min-h-[300px] w-full flex-col rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 sm:min-h-[350px] sm:p-6 lg:min-h-[400px]'>
        {/* Year header with link */}
        <div className='mb-4 flex items-center justify-between sm:mb-6'>
          <h3 className='text-2xl font-extrabold text-white drop-shadow-lg sm:text-3xl'>
            {year}
          </h3>
          {yearRoute && (
            <Link
              href={yearRoute}
              className='group inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:px-4 sm:text-sm'
            >
              {t('view_all') || 'View all'}
              <FiArrowRight className='h-3 w-3 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4' />
            </Link>
          )}
        </div>

        {/* Image content */}
        {loading ? (
          <div className='mb-4 grid flex-1 grid-cols-3 gap-2 sm:gap-3'>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className='aspect-square animate-pulse rounded-lg bg-white/20'
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              />
            ))}
          </div>
        ) : (
          <div className='mb-4 flex flex-1 flex-col'>{renderContent()}</div>
        )}

        {/* Call to action text */}
        {/* <div className='flex items-center justify-center border-t border-white/10 pt-3 sm:pt-4'>
          <p className='text-xs text-white/70 sm:text-sm'>
            {t('check_all_images') || `Check all of the ${year} images here`}
          </p>
        </div> */}
      </div>
    </div>
  )
}

// Main component
export default function OptimizedGalleryHero() {
  const t = useTranslations('GalleryPage.Hero')
  const locale = useLocale()
  const { isVisible, sectionRef } = useStaggeredAnimation(0.1)

  // Use our optimized gallery hook - only destructure what we need
  const {
    imagesByYear,
    availableYears,
    loading,
    error,
    getImagesForYear,
    isEmpty
  } = useOptimizedGallery(IMAGES_PER_YEAR)

  // Handle image click (could open lightbox, navigate, etc.)
  const handleImageClick = useCallback((image: ProcessedImage) => {
    // Could implement lightbox or other actions here
    console.log('Image clicked:', image.public_id)
  }, [])

  return (
    <section
      ref={sectionRef}
      className='relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900'
    >
      {/* Background image with overlay */}
      <div className='absolute inset-0'>
        <Image
          src={ASSETS.background}
          alt='Gallery background'
          fill
          quality={85}
          priority
          className='object-cover object-center'
          sizes='100vw'
        />
        {/* Gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-r from-slate-900/80 via-sky-900/60 to-slate-900/80' />
        {/* Additional bottom gradient for better text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />
      </div>

      {/* Content */}
      <div className='relative z-10 flex min-h-screen flex-col'>
        {/* Hero header */}
        <div className='flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-screen-2xl text-center'>
            {/* Main title */}
            <div
              className={clsx(
                'mb-8 transition-all duration-1000 ease-out',
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-12 opacity-0'
              )}
            >
              <h1 className='mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-4xl font-extrabold text-transparent drop-shadow-2xl sm:text-5xl lg:text-6xl'>
                {t('title') || 'Gallery'}
              </h1>

              {/* Tagline image */}
              <div className='mx-auto mb-6 h-8 w-auto max-w-xs'>
                <Image
                  src={ASSETS.tagline}
                  alt='Cascais Cup tagline'
                  width={300}
                  height={32}
                  quality={90}
                  priority
                  className='h-full w-full object-contain'
                />
              </div>

              <p className='mx-auto max-w-2xl text-lg text-white/90 sm:text-xl'>
                {t('subtitle') ||
                  'Relive the best moments from Cascais Cup through the years'}
              </p>
            </div>

            {/* Remove status indicator section completely */}

            {/* Year cards grid */}
            <div className='mx-auto max-w-7xl'>
              {loading && availableYears.length === 0 ? (
                // Loading skeletons
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <YearCardSkeleton key={index} />
                  ))}
                </div>
              ) : isEmpty ? (
                // Empty state
                <div
                  className={clsx(
                    'mx-auto max-w-md rounded-2xl bg-white/10 p-12 text-center backdrop-blur-sm transition-all duration-1000 ease-out',
                    isVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  )}
                  style={{ transitionDelay: '200ms' }}
                >
                  <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10'>
                    <FiImage className='h-8 w-8 text-white/60' />
                  </div>
                  <h3 className='mb-2 text-xl font-semibold text-white'>
                    {t('empty_title') || 'No images available'}
                  </h3>
                  <p className='text-white/80'>
                    {t('empty_description') ||
                      'Gallery images will appear here soon. Check back later!'}
                  </p>
                </div>
              ) : (
                // Year cards
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {availableYears
                    .sort((a, b) => b - a) // Sort descending (newest first)
                    .map((year, index) => (
                      <YearCard
                        key={year}
                        year={year}
                        images={getImagesForYear(year)}
                        loading={loading}
                        error={error}
                        locale={locale}
                        t={t}
                        isVisible={isVisible}
                        cardIndex={index}
                        onImageClick={handleImageClick}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
