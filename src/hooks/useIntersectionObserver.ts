// src/hooks/useIntersectionObserver.ts
// Reusable intersection observer hook for scroll-triggered animations
// Replaces the duplicated pattern found in:
// - AccommodationHero, AboutVilla, AboutPortugal
// - CompetitionFacts, CompetitionHero, CompetitionInfo
// - ProgramHero, LandingLocation, LandingUpdates
// - GalleryHero, HallOfFameHero, HallOfFameParticipants

'use client'

import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  /** Threshold at which the observer triggers (0 to 1). Default: 0.1 */
  threshold?: number
  /** Margin around the root element. Default: '50px' */
  rootMargin?: string
  /** If true, observer disconnects after first intersection. Default: true */
  triggerOnce?: boolean
}

/**
 * Hook that tracks whether an element is visible in the viewport.
 * Disconnects automatically after first intersection by default (triggerOnce).
 *
 * @example
 * ```tsx
 * const { ref, isVisible } = useIntersectionObserver()
 *
 * return (
 *   <section ref={ref}>
 *     <div className={isVisible ? 'opacity-100' : 'opacity-0'}>
 *       Content fades in when scrolled into view
 *     </div>
 *   </section>
 * )
 * ```
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true
}: UseIntersectionObserverOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observer.disconnect()
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isVisible }
}

/**
 * Convenience alias matching the existing `useStaggeredAnimation` name
 * used in GalleryHero and HallOfFameHero.
 */
export function useStaggeredAnimation(threshold = 0.2) {
  const { ref: sectionRef, isVisible } = useIntersectionObserver({
    threshold,
    rootMargin: '50px'
  })
  return { sectionRef, isVisible }
}
