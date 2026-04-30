'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface ProcessedImage {
  public_id: string
  url: string
  created_at: string
  width: number
  height: number
  format: string
  aspect_ratio: number
}

export interface GalleryData {
  imagesByYear: Record<number, ProcessedImage[]>
  totalImages: number
  availableYears: number[]
  errors: string[] | null
  timestamp: string
}

const CACHE_KEY = 'cascais-gallery-cache'
const CACHE_DURATION = 5 * 60 * 1000
const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1000

let memoryCache: { data: GalleryData; timestamp: number } | null = null

const cacheUtils = {
  get(): { data: GalleryData; timestamp: number } | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) return JSON.parse(cached)
    } catch (error) {
      console.warn('Failed to read from localStorage cache:', error)
    }
    return memoryCache
  },
  set(data: GalleryData): void {
    const entry = { data, timestamp: Date.now() }
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
    } catch (error) {
      console.warn('Failed to write to localStorage cache:', error)
    }
    memoryCache = entry
  },
  isValid(ts: number): boolean {
    return Date.now() - ts < CACHE_DURATION
  }
}

function abortableSleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'))
      return
    }
    const timeout = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    const onAbort = () => {
      clearTimeout(timeout)
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'))
    }
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

async function fetchGalleryWithRetry(
  maxPerYear: number,
  signal: AbortSignal,
  attempt = 1
): Promise<GalleryData> {
  try {
    const response = await fetch(`/api/cloudinary?maxPerYear=${maxPerYear}`, {
      signal,
      headers: { 'Cache-Control': 'no-cache' }
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const result = await response.json()
    if (!result.success) {
      throw new Error(result.error || 'API returned unsuccessful response')
    }
    return {
      imagesByYear: result.imagesByYear || {},
      totalImages: result.totalImages || 0,
      availableYears: result.availableYears || [],
      errors: result.errors,
      timestamp: result.timestamp || new Date().toISOString()
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error
    if (attempt < MAX_RETRY_ATTEMPTS) {
      console.warn(`Fetch attempt ${attempt} failed, retrying...`, error)
      await abortableSleep(RETRY_DELAY * attempt, signal)
      return fetchGalleryWithRetry(maxPerYear, signal, attempt + 1)
    }
    throw error
  }
}

type State = {
  data: GalleryData | null
  loading: boolean
  error: string | null
}

const INITIAL_STATE: State = { data: null, loading: true, error: null }

export function useOptimizedGallery(maxPerYear: number = 8) {
  const [state, setState] = useState<State>(INITIAL_STATE)
  const lastFetchRef = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    void (async () => {
      const cached = cacheUtils.get()
      if (cached && cacheUtils.isValid(cached.timestamp)) {
        if (cancelled) return
        lastFetchRef.current = cached.timestamp
        setState({ data: cached.data, loading: false, error: null })
        return
      }

      try {
        const data = await fetchGalleryWithRetry(maxPerYear, controller.signal)
        if (cancelled) return
        cacheUtils.set(data)
        lastFetchRef.current = Date.now()
        setState({ data, loading: false, error: null })
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        if (cancelled) return
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load gallery'
        console.error('Gallery fetch error:', error)
        setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      }
    })()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [maxPerYear])

  useEffect(() => {
    let activeController: AbortController | null = null
    const handler = () => {
      if (document.hidden) return
      const last = lastFetchRef.current
      if (last && Date.now() - last < CACHE_DURATION) return

      activeController?.abort()
      const controller = new AbortController()
      activeController = controller
      void (async () => {
        try {
          const data = await fetchGalleryWithRetry(
            maxPerYear,
            controller.signal
          )
          cacheUtils.set(data)
          lastFetchRef.current = Date.now()
          setState({ data, loading: false, error: null })
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') return
          console.warn('Background gallery refresh failed:', error)
        }
      })()
    }
    document.addEventListener('visibilitychange', handler)
    return () => {
      document.removeEventListener('visibilitychange', handler)
      activeController?.abort()
    }
  }, [maxPerYear])

  const getImagesForYear = useCallback(
    (year: number): ProcessedImage[] => state.data?.imagesByYear[year] || [],
    [state.data]
  )

  const totalImages = state.data?.totalImages ?? 0

  return {
    availableYears: state.data?.availableYears || [],
    loading: state.loading,
    error: state.error,
    getImagesForYear,
    isEmpty: !state.data || totalImages === 0
  }
}
