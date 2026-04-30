'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface Options {
  loop?: boolean
}

interface SnapCarousel {
  scrollRef: React.RefObject<HTMLDivElement | null>
  activePage: number
  pageCount: number
  goToPage: (index: number) => void
  next: () => void
  prev: () => void
}

function measure(el: HTMLDivElement) {
  const { scrollLeft, clientWidth, scrollWidth } = el
  if (clientWidth <= 0) return { activePage: 0, pageCount: 0 }
  const pageCount = Math.max(1, Math.ceil(scrollWidth / clientWidth))
  const activePage = Math.min(
    pageCount - 1,
    Math.max(0, Math.round(scrollLeft / clientWidth))
  )
  return { activePage, pageCount }
}

export function useSnapCarousel({ loop = false }: Options = {}): SnapCarousel {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [activePage, setActivePage] = useState(0)
  const [pageCount, setPageCount] = useState(0)

  const goToPage = useCallback(
    (index: number) => {
      const el = scrollRef.current
      if (!el || pageCount <= 0) return
      const clamped = ((index % pageCount) + pageCount) % pageCount
      el.scrollTo({ left: el.clientWidth * clamped, behavior: 'smooth' })
    },
    [pageCount]
  )

  const next = useCallback(() => {
    if (pageCount <= 0) return
    if (activePage + 1 >= pageCount) {
      if (loop) goToPage(0)
      return
    }
    goToPage(activePage + 1)
  }, [activePage, pageCount, loop, goToPage])

  const prev = useCallback(() => {
    if (pageCount <= 0) return
    if (activePage - 1 < 0) {
      if (loop) goToPage(pageCount - 1)
      return
    }
    goToPage(activePage - 1)
  }, [activePage, pageCount, loop, goToPage])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let frame = 0
    const sync = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const m = measure(el)
        setActivePage(m.activePage)
        setPageCount(m.pageCount)
      })
    }

    sync()

    const ro = new ResizeObserver(sync)
    ro.observe(el)
    el.addEventListener('scroll', sync, { passive: true })
    return () => {
      ro.disconnect()
      el.removeEventListener('scroll', sync)
      cancelAnimationFrame(frame)
    }
  }, [])

  return { scrollRef, activePage, pageCount, goToPage, next, prev }
}
