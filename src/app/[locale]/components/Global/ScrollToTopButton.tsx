'use client'

import { useCallback, useEffect, useState } from 'react'
import { FaChevronUp } from 'react-icons/fa'
import clsx from 'clsx'

interface Props {
  threshold?: number
  className?: string
}

export default function ScrollToTopButton({
  threshold = 300,
  className
}: Props) {
  const [visible, setVisible] = useState(false)

  // Throttled scroll handler for better performance
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > threshold
      setVisible(scrolled)
    }

    // Throttle scroll events
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [threshold])

  const scrollToTop = useCallback(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'instant' : 'smooth'
    })
  }, [])

  // Handle keyboard interaction
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        scrollToTop()
      }
    },
    [scrollToTop]
  )

  if (!visible) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      aria-label='Scroll to top of page'
      className={clsx(
        'group fixed bottom-6 right-6 z-50',
        'flex h-12 w-12 items-center justify-center',
        'rounded-full bg-sky-700 text-white shadow-lg',
        'transition-all duration-300 ease-out',
        'hover:scale-110 hover:bg-sky-800 hover:shadow-xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2',
        'active:scale-95',
        // Smooth entrance/exit animations
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0',

        className
      )}
    >
      <FaChevronUp
        className={clsx(
          'h-5 w-5 transition-transform duration-200',
          'group-hover:-translate-y-0.5'
        )}
        aria-hidden='true'
      />

      {/* Ripple effect background */}
      <span
        className='absolute inset-0 scale-0 rounded-full bg-white/20 transition-transform duration-300 group-active:scale-100'
        aria-hidden='true'
      />
    </button>
  )
}
