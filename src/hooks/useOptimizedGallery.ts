// hooks/useOptimizedGallery.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

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

export interface GalleryState {
  data: GalleryData | null
  loading: boolean
  error: string | null
  lastFetch: number | null
  fromCache: boolean
}

// Cache configuration
const CACHE_KEY = 'cascais-gallery-cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1000 // 1 second

// Simple in-memory cache as fallback
let memoryCache: { data: GalleryData; timestamp: number } | null = null

// Cache management utilities
const cacheUtils = {
  // Get from localStorage with fallback to memory
  get(): { data: GalleryData; timestamp: number } | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch (error) {
      console.warn('Failed to read from localStorage cache:', error)
    }
    return memoryCache
  },

  // Set to both localStorage and memory
  set(data: GalleryData): void {
    const cacheEntry = { data, timestamp: Date.now() }

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry))
    } catch (error) {
      console.warn('Failed to write to localStorage cache:', error)
    }

    // Always set memory cache as fallback
    memoryCache = cacheEntry
  },

  // Check if cache is valid
  isValid(cacheTimestamp: number): boolean {
    return Date.now() - cacheTimestamp < CACHE_DURATION
  },

  // Clear both caches
  clear(): void {
    try {
      localStorage.removeItem(CACHE_KEY)
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error)
    }
    memoryCache = null
  }
}

export function useOptimizedGallery(maxPerYear: number = 8) {
  const [state, setState] = useState<GalleryState>({
    data: null,
    loading: false,
    error: null,
    lastFetch: null,
    fromCache: false
  })

  const abortControllerRef = useRef<AbortController>()
  const retryTimeoutRef = useRef<NodeJS.Timeout>()

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
  }, [])

  // Fetch data with retry logic
  const fetchWithRetry = useCallback(
    async (attempt: number = 1): Promise<GalleryData> => {
      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        const response = await fetch(
          `/api/cloudinary?maxPerYear=${maxPerYear}`,
          {
            signal: controller.signal,
            headers: {
              'Cache-Control': 'no-cache' // Force fresh data on explicit fetch
            }
          }
        )

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
        // Handle abort
        if (error instanceof Error && error.name === 'AbortError') {
          throw error
        }

        // Retry logic for network errors
        if (attempt < MAX_RETRY_ATTEMPTS) {
          console.warn(`Fetch attempt ${attempt} failed, retrying...`, error)

          await new Promise(resolve => {
            retryTimeoutRef.current = setTimeout(resolve, RETRY_DELAY * attempt)
          })

          return fetchWithRetry(attempt + 1)
        }

        throw error
      }
    },
    [maxPerYear]
  )

  // Main fetch function
  const fetchGalleryData = useCallback(
    async (forceRefresh: boolean = false) => {
      // Don't start new request if already loading
      if (state.loading) return

      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        // Check cache first (unless force refresh)
        if (!forceRefresh) {
          const cached = cacheUtils.get()
          if (cached && cacheUtils.isValid(cached.timestamp)) {
            setState(prev => ({
              ...prev,
              data: cached.data,
              loading: false,
              lastFetch: cached.timestamp,
              fromCache: true
            }))
            return
          }
        }

        // Fetch fresh data
        const data = await fetchWithRetry()

        // Cache the results
        cacheUtils.set(data)

        setState(prev => ({
          ...prev,
          data,
          loading: false,
          error: null,
          lastFetch: Date.now(),
          fromCache: false
        }))
      } catch (error) {
        // Don't update state if request was aborted
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }

        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load gallery'

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }))

        console.error('Gallery fetch error:', error)
      }
    },
    [state.loading, fetchWithRetry]
  )

  // Force refresh function
  const refresh = useCallback(() => {
    cleanup()
    fetchGalleryData(true)
  }, [cleanup, fetchGalleryData])

  // Get images for specific year
  const getImagesForYear = useCallback(
    (year: number): ProcessedImage[] => {
      return state.data?.imagesByYear[year] || []
    },
    [state.data]
  )

  // Get total images count
  const getTotalImagesCount = useCallback((): number => {
    return state.data?.totalImages || 0
  }, [state.data])

  // Check if data is stale
  const isStale = useCallback((): boolean => {
    if (!state.lastFetch) return true
    return Date.now() - state.lastFetch > CACHE_DURATION
  }, [state.lastFetch])

  // Initial fetch on mount
  useEffect(() => {
    fetchGalleryData()

    // Cleanup on unmount
    return cleanup
  }, []) // Empty dependency array - only run on mount

  // Auto-refresh stale data when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isStale()) {
        fetchGalleryData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchGalleryData, isStale])

  return {
    // Data
    data: state.data,
    imagesByYear: state.data?.imagesByYear || {},
    availableYears: state.data?.availableYears || [],
    errors: state.data?.errors,

    // Status
    loading: state.loading,
    error: state.error,
    fromCache: state.fromCache,
    isStale: isStale(),
    lastFetch: state.lastFetch,

    // Actions
    refresh,
    clearCache: cacheUtils.clear,

    // Utilities
    getImagesForYear,
    getTotalImagesCount,

    // Meta
    isEmpty: !state.data || getTotalImagesCount() === 0
  }
}
