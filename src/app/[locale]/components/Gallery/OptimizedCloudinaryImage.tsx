// components/OptimizedCloudinaryImage.tsx
'use client'

import Image from 'next/image'
import { useState, useCallback, useMemo } from 'react'
import clsx from 'clsx'

export interface OptimizedCloudinaryImageProps {
  publicId: string
  alt: string
  width?: number
  height?: number
  aspectRatio?: number
  quality?: number | 'auto'
  format?: string | 'auto'
  crop?: string
  gravity?: string
  className?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  sizes?: string
  onLoad?: () => void
  onError?: () => void
  onClick?: () => void
  showLoadingState?: boolean
  cloudName?: string
}

// Default Cloudinary configuration
const DEFAULT_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'
const DEFAULT_QUALITY = 'auto'
const DEFAULT_FORMAT = 'auto'
const DEFAULT_CROP = 'fill'
const DEFAULT_GRAVITY = 'auto'

// Breakpoint configurations for responsive images
const RESPONSIVE_BREAKPOINTS = [
  { width: 400, suffix: 'mobile' },
  { width: 800, suffix: 'tablet' },
  { width: 1200, suffix: 'desktop' },
  { width: 1600, suffix: 'xl' }
]

/**
 * Build Cloudinary URL with transformations
 */
function buildCloudinaryUrl(
  publicId: string,
  width: number,
  height: number,
  options: {
    quality?: number | 'auto'
    format?: string | 'auto'
    crop?: string
    gravity?: string
    cloudName?: string
  } = {}
): string {
  const {
    quality = DEFAULT_QUALITY,
    format = DEFAULT_FORMAT,
    crop = DEFAULT_CROP,
    gravity = DEFAULT_GRAVITY,
    cloudName = DEFAULT_CLOUD_NAME
  } = options

  // Build transformation string
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `g_${gravity}`,
    `q_${quality}`,
    `f_${format}`
  ].join(',')

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`
}

/**
 * Generate srcset for responsive images
 */
function generateSrcSet(
  publicId: string,
  baseWidth: number,
  baseHeight: number,
  options: {
    quality?: number | 'auto'
    format?: string | 'auto'
    crop?: string
    gravity?: string
    cloudName?: string
  } = {}
): string {
  const aspectRatio = baseWidth / baseHeight

  return RESPONSIVE_BREAKPOINTS.map(({ width }) => {
    const height = Math.round(width / aspectRatio)
    const url = buildCloudinaryUrl(publicId, width, height, options)
    return `${url} ${width}w`
  }).join(', ')
}

/**
 * Generate blur placeholder
 */
function generateBlurDataUrl(
  publicId: string,
  cloudName: string = DEFAULT_CLOUD_NAME
): string {
  // Very small, heavily compressed version for blur placeholder
  const blurUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_10,h_10,c_fill,g_auto,q_10,f_auto/${publicId}`

  // Convert to base64 data URL (simplified)
  return `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==`
}

export default function OptimizedCloudinaryImage({
  publicId,
  alt,
  width = 800,
  height = 600,
  aspectRatio,
  quality = DEFAULT_QUALITY,
  format = DEFAULT_FORMAT,
  crop = DEFAULT_CROP,
  gravity = DEFAULT_GRAVITY,
  className,
  priority = false,
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw',
  onLoad,
  onError,
  onClick,
  showLoadingState = true,
  cloudName = DEFAULT_CLOUD_NAME
}: OptimizedCloudinaryImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Calculate dimensions based on aspect ratio if provided
  const { finalWidth, finalHeight } = useMemo(() => {
    if (aspectRatio && !height) {
      return { finalWidth: width, finalHeight: Math.round(width / aspectRatio) }
    }
    if (aspectRatio && !width) {
      return {
        finalWidth: Math.round(height! * aspectRatio),
        finalHeight: height!
      }
    }
    return { finalWidth: width, finalHeight: height }
  }, [width, height, aspectRatio])

  // Build URLs with Next.js optimization
  const mainUrl = useMemo(
    () =>
      buildCloudinaryUrl(publicId, finalWidth, finalHeight, {
        quality,
        format,
        crop,
        gravity,
        cloudName
      }),
    [
      publicId,
      finalWidth,
      finalHeight,
      quality,
      format,
      crop,
      gravity,
      cloudName
    ]
  )

  const blurDataUrl = useMemo(
    () => generateBlurDataUrl(publicId, cloudName),
    [publicId, cloudName]
  )

  // Handle image load
  const handleLoad = useCallback(() => {
    setImageLoaded(true)
    onLoad?.()
  }, [onLoad])

  // Handle image error
  const handleError = useCallback(() => {
    setImageError(true)
    setImageLoaded(true)
    onError?.()
  }, [onError])

  // Handle click
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick()
    }
  }, [onClick])

  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-slate-100',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      {/* Loading state */}
      {showLoadingState && !imageLoaded && (
        <div
          className='absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 to-slate-200'
          style={{ aspectRatio: finalWidth / finalHeight }}
        />
      )}

      {/* Main image */}
      {!imageError && (
        <Image
          src={mainUrl}
          alt={alt}
          width={finalWidth}
          height={finalHeight}
          className={clsx(
            'transition-opacity duration-500',
            imageLoaded ? 'opacity-100' : 'opacity-0',
            showLoadingState && !imageLoaded && 'absolute inset-0'
          )}
          loading={loading}
          priority={priority}
          quality={typeof quality === 'number' ? quality : 75}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          placeholder='blur'
          blurDataURL={blurDataUrl}
        />
      )}

      {/* Error fallback */}
      {imageError && (
        <div
          className='flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-sm text-slate-500'
          style={{
            aspectRatio: finalWidth / finalHeight,
            minHeight: '120px'
          }}
        >
          <div className='text-center'>
            <div className='mb-2'>📷</div>
            <div>Image unavailable</div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {showLoadingState && !imageLoaded && !imageError && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500' />
        </div>
      )}
    </div>
  )
}

// Preset variants for common use cases
export const CloudinaryImageVariants = {
  thumbnail: (
    props: Omit<OptimizedCloudinaryImageProps, 'width' | 'height'>
  ) => (
    <OptimizedCloudinaryImage
      {...props}
      width={300}
      height={225}
      quality={60}
      sizes='300px'
    />
  ),

  card: (props: Omit<OptimizedCloudinaryImageProps, 'width' | 'height'>) => (
    <OptimizedCloudinaryImage
      {...props}
      width={400}
      height={240}
      quality={70}
      sizes='(max-width: 768px) 100vw, 400px'
    />
  ),

  hero: (props: Omit<OptimizedCloudinaryImageProps, 'width' | 'height'>) => (
    <OptimizedCloudinaryImage
      {...props}
      width={1200}
      height={600}
      quality={80}
      priority={true}
      sizes='100vw'
    />
  ),

  gallery: (props: Omit<OptimizedCloudinaryImageProps, 'width' | 'height'>) => (
    <OptimizedCloudinaryImage
      {...props}
      width={600}
      height={450}
      quality={70}
      sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
    />
  )
}
