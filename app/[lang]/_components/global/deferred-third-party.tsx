'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const NextTopLoader = dynamic(() => import('nextjs-toploader'), { ssr: false })
const Analytics = dynamic(
  () => import('@vercel/analytics/next').then(m => m.Analytics),
  { ssr: false }
)
const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then(m => m.SpeedInsights),
  { ssr: false }
)

export default function DeferredThirdParty() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number
      cancelIdleCallback?: (id: number) => void
    }
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(() => setMounted(true))
    } else {
      // Safari < 17 has no requestIdleCallback — defer past first paint
      timeoutId = setTimeout(() => setMounted(true), 1500)
    }

    return () => {
      if (idleId !== undefined && typeof w.cancelIdleCallback === 'function') {
        w.cancelIdleCallback(idleId)
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <NextTopLoader
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        easing='ease'
        speed={200}
        shadow='0 0 10px #2299DD,0 0 5px #2299DD'
        color='var(--primary)'
        showSpinner={false}
      />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
