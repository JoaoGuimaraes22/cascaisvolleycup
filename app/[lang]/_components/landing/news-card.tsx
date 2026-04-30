'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BLUR_DATA_URL } from '../../_lib/constants'

export interface NewsCardProps {
  title: string
  date: string
  excerpt: string
  image: string
  link: string
  priority?: boolean
}

export default function NewsCard({
  title,
  date,
  excerpt,
  image,
  link,
  priority = false
}: NewsCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true) // Still show the card even if image fails
  }

  return (
    <Link
      href={link}
      className='group block rounded-xl bg-white/90 p-2 shadow-sm ring-1 ring-black/5 transition will-change-transform hover:-translate-y-1 hover:shadow-md'
    >
      <div className='relative overflow-hidden rounded-lg bg-slate-100'>
        {/* Placeholder background while loading */}
        {!imageLoaded && (
          <div className='h-40 w-full bg-gradient-to-br from-slate-100 to-slate-200 motion-safe:animate-pulse sm:h-44' />
        )}

        {/* Main image */}
        {!imageError && (
          <Image
            src={image}
            alt={title}
            width={400}
            height={240}
            className={`h-40 w-full object-cover duration-500 group-hover:scale-[1.02] motion-safe:transition-all sm:h-44 ${
              imageLoaded ? 'opacity-100' : 'absolute inset-0 opacity-0'
            }`}
            loading={priority ? 'eager' : 'lazy'}
            quality={60} // Reduced from 75 for faster loading
            sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={priority}
            placeholder='blur'
            blurDataURL={BLUR_DATA_URL}
          />
        )}

        {/* Fallback for failed images */}
        {imageError && (
          <div className='flex h-40 w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 sm:h-44'>
            <div className='text-sm text-slate-500'>Image unavailable</div>
          </div>
        )}
      </div>

      <div className='px-2 py-4'>
        <h3 className='text-primary line-clamp-2 text-base leading-snug font-extrabold uppercase sm:text-lg'>
          {title}
        </h3>
        <p className='mt-1 text-xs text-slate-500'>{date}</p>
        <p className='mt-2 line-clamp-2 text-sm text-slate-600'>{excerpt}</p>
      </div>
    </Link>
  )
}
