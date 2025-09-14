// src/app/[locale]/components/Gallery/Gallery.tsx
'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'
import { FiGrid, FiList, FiRefreshCw, FiPlus } from 'react-icons/fi'

// Import optimized components
import OptimizedCloudinaryImage from './OptimizedCloudinaryImage'
import { ProcessedImage } from '@/src/hooks/useOptimizedGallery'

// Grid size configurations
type GridSize = 'small' | 'medium' | 'large'

interface GridDimensions {
  small: { width: number; height: number; cols: string }
  medium: { width: number; height: number; cols: string }
  large: { width: number; height: number; cols: string }
}

const dimensions: GridDimensions = {
  small: {
    width: 300,
    height: 225,
    cols: 'grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
  },
  medium: {
    width: 400,
    height: 300,
    cols: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  },
  large: {
    width: 600,
    height: 450,
    cols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }
}

const IMAGES_PER_LOAD = 30

interface OptimizedGalleryProps {
  folder?: string
  year?: number
  title?: string
  description?: string
}

// Custom hook for progressive image loading
function useProgressiveGallery(year?: number, folder?: string) {
  const [images, setImages] = useState<ProcessedImage[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  const loadImages = useCallback(
    async (isLoadMore = false) => {
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setImages([])
        setOffset(0)
        setHasMore(true)
      }

      try {
        let url = `/api/cloudinary?max=${IMAGES_PER_LOAD}&offset=${isLoadMore ? offset : 0}`

        if (folder) {
          url += `&folder=${folder}`
        } else if (year) {
          // For year-based requests, we'll need to map to folder
          url += `&folder=cascaiscup/${year}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch images')
        }

        const newImages = result.images || []

        if (isLoadMore) {
          setImages(prev => [...prev, ...newImages])
          setOffset(prev => prev + IMAGES_PER_LOAD)
        } else {
          setImages(newImages)
          setOffset(IMAGES_PER_LOAD)
        }

        // Check if there are more images to load
        setHasMore(newImages.length === IMAGES_PER_LOAD)
        setError(null)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        console.error('❌ Gallery fetch error:', err)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [year, folder, offset]
  )

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadImages(true)
    }
  }, [loadImages, loadingMore, hasMore])

  const refresh = useCallback(() => {
    loadImages(false)
  }, [loadImages])

  useEffect(() => {
    loadImages(false)
  }, [year, folder]) // Re-load when year or folder changes

  return {
    images,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    totalLoaded: images.length
  }
}

// Individual image item component
function GalleryImageItem({
  image,
  index,
  size,
  onImageClick
}: {
  image: ProcessedImage
  index: number
  size: GridSize
  onImageClick?: (image: ProcessedImage) => void
}) {
  return (
    <div
      className={clsx(
        'group relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200 transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-lg hover:shadow-black/25 hover:ring-2 hover:ring-sky-300',
        onImageClick && 'cursor-pointer'
      )}
      onClick={() => onImageClick?.(image)}
    >
      {image ? (
        <OptimizedCloudinaryImage
          publicId={image.public_id}
          alt={`Gallery image ${index + 1}`}
          width={dimensions[size].width}
          height={dimensions[size].height}
          quality={70}
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
          loading='lazy'
          sizes={`(max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${100 / (size === 'small' ? 5 : size === 'medium' ? 4 : 3)}vw`}
        />
      ) : (
        <div className='h-full w-full animate-pulse bg-slate-200' />
      )}

      {/* Hover overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

      {/* Image info on hover */}
      <div className='absolute bottom-2 left-2 right-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
        <p className='truncate text-xs'>
          {image.format?.toUpperCase()} • {image.width} × {image.height}
        </p>
      </div>
    </div>
  )
}

// Load More button component interface
interface LoadMoreButtonProps {
  onLoadMore: () => void
  loading: boolean
  hasMore: boolean
  totalLoaded: number
  allLoadedText: string
  loadMoreText: string
  loadingMoreText: string
  imageText: string
  imagesText: string
}

function LoadMoreButton({
  onLoadMore,
  loading,
  hasMore,
  totalLoaded,
  allLoadedText,
  loadMoreText,
  loadingMoreText,
  imageText,
  imagesText
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className='py-8 text-center'>
        <p className='text-slate-600'>
          {allLoadedText} ({totalLoaded}{' '}
          {totalLoaded === 1 ? imageText : imagesText})
        </p>
      </div>
    )
  }

  return (
    <div className='flex justify-center py-8'>
      <button
        onClick={onLoadMore}
        disabled={loading}
        className={clsx(
          'inline-flex items-center gap-3 rounded-full px-8 py-4 font-medium transition-all duration-200',
          'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg',
          'hover:-translate-y-0.5 hover:from-sky-600 hover:to-blue-700 hover:shadow-xl',
          'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
          'disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        {loading ? (
          <>
            <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
            {loadingMoreText}
          </>
        ) : (
          <>
            <FiPlus className='h-5 w-5' />
            {loadMoreText}
          </>
        )}
      </button>
    </div>
  )
}

export default function OptimizedGallery({
  folder,
  year,
  title,
  description
}: OptimizedGalleryProps) {
  const t = useTranslations('GalleryPage.Main')

  // Gallery state
  const [gridSize, setGridSize] = useState<GridSize>('medium')
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(
    null
  )
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Use progressive loading hook
  const {
    images,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    totalLoaded
  } = useProgressiveGallery(year, folder)

  // Lightbox handlers
  const openLightbox = useCallback((image: ProcessedImage) => {
    setSelectedImage(image)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    setSelectedImage(null)
  }, [])

  const nextImage = useCallback(() => {
    if (!selectedImage) return
    const currentIndex = images.findIndex(
      img => img.public_id === selectedImage.public_id
    )
    const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
    setSelectedImage(images[nextIndex])
  }, [selectedImage, images])

  const prevImage = useCallback(() => {
    if (!selectedImage) return
    const currentIndex = images.findIndex(
      img => img.public_id === selectedImage.public_id
    )
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
    setSelectedImage(images[prevIndex])
  }, [selectedImage, images])

  // Grid size options
  const gridSizeOptions: { value: GridSize; icon: any; label: string }[] = [
    { value: 'small', icon: FiGrid, label: t('grid_sizes.small') },
    { value: 'medium', icon: FiGrid, label: t('grid_sizes.medium') },
    { value: 'large', icon: FiList, label: t('grid_sizes.large') }
  ]

  if (loading && images.length === 0) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent' />
          <p className='mt-4 text-slate-600'>{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (error && images.length === 0) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
            <FiRefreshCw className='h-8 w-8 text-red-600' />
          </div>
          <h3 className='mb-2 text-lg font-semibold text-slate-900'>
            {t('failed_title')}
          </h3>
          <p className='mb-4 text-slate-600'>{error}</p>
          <button
            onClick={refresh}
            className='inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-white hover:bg-sky-600'
          >
            <FiRefreshCw className='h-4 w-4' />
            {t('try_again')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      {(title || description) && (
        <div className='mb-8 text-center'>
          {title && (
            <h1 className='mb-4 text-3xl font-bold text-slate-900'>{title}</h1>
          )}
          {description && (
            <p className='mx-auto max-w-2xl text-slate-600'>{description}</p>
          )}
        </div>
      )}

      {/* Controls */}
      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-slate-600'>
            {totalLoaded} {totalLoaded === 1 ? t('image') : t('images')}
            {hasMore && ` (${t('more_available')})`}
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-sm text-slate-600'>{t('grid_size')}:</span>
          {gridSizeOptions.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setGridSize(value)}
              className={clsx(
                'rounded-lg p-2 text-sm transition-colors',
                gridSize === value
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              )}
              title={label}
            >
              <Icon className='h-4 w-4' />
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className={clsx('grid gap-4', dimensions[gridSize].cols)}>
        {images.map((image, index) => (
          <GalleryImageItem
            key={image.public_id}
            image={image}
            index={index}
            size={gridSize}
            onImageClick={openLightbox}
          />
        ))}
      </div>

      {/* Load More Button */}
      <LoadMoreButton
        onLoadMore={loadMore}
        loading={loadingMore}
        hasMore={hasMore}
        totalLoaded={totalLoaded}
        allLoadedText={t('all_loaded')}
        loadMoreText={t('load_more')}
        loadingMoreText={t('loading_more')}
        imageText={t('image')}
        imagesText={t('images')}
      />

      {/* Lightbox */}
      {lightboxOpen && selectedImage && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4'>
          <div className='relative max-h-full max-w-4xl'>
            <OptimizedCloudinaryImage
              publicId={selectedImage.public_id}
              alt={t('gallery_image')}
              width={1200}
              height={800}
              quality={90}
              className='max-h-full max-w-full object-contain'
            />
            <button
              onClick={closeLightbox}
              className='absolute right-4 top-4 rounded-full p-2 text-white hover:bg-white/20'
              aria-label={t('close_lightbox')}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
