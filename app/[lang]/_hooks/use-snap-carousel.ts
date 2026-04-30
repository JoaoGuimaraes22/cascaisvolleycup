'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface Options {
  slideCount: number
  loop?: boolean
}

interface SnapCarousel {
  scrollRef: React.RefObject<HTMLDivElement | null>
  activeIndex: number
  goToSlide: (index: number) => void
  next: () => void
  prev: () => void
}

function getCardWidth(el: HTMLDivElement, count: number): number {
  if (count <= 0) return 0
  return el.scrollWidth / count
}

export function useSnapCarousel({
  slideCount,
  loop = false
}: Options): SnapCarousel {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const goToSlide = useCallback(
    (index: number) => {
      const el = scrollRef.current
      if (!el || slideCount <= 0) return
      const clamped = ((index % slideCount) + slideCount) % slideCount
      const cardWidth = getCardWidth(el, slideCount)
      el.scrollTo({ left: cardWidth * clamped, behavior: 'smooth' })
    },
    [slideCount]
  )

  const next = useCallback(() => {
    if (slideCount <= 0) return
    const nextIdx = activeIndex + 1
    if (nextIdx >= slideCount) {
      if (loop) goToSlide(0)
      return
    }
    goToSlide(nextIdx)
  }, [activeIndex, slideCount, loop, goToSlide])

  const prev = useCallback(() => {
    if (slideCount <= 0) return
    const prevIdx = activeIndex - 1
    if (prevIdx < 0) {
      if (loop) goToSlide(slideCount - 1)
      return
    }
    goToSlide(prevIdx)
  }, [activeIndex, slideCount, loop, goToSlide])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || slideCount <= 0) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const cardWidth = getCardWidth(el, slideCount)
        if (cardWidth <= 0) return
        const idx = Math.round(el.scrollLeft / cardWidth)
        setActiveIndex(Math.max(0, Math.min(slideCount - 1, idx)))
      })
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [slideCount])

  return { scrollRef, activeIndex, goToSlide, next, prev }
}
