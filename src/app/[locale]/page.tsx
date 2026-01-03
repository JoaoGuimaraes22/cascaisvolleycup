// OPTIMIZED Landing Page - Dynamic imports for code splitting
// src/app/[locale]/page.tsx

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import LandingWelcome from './components/Landing/LandingWelcome'

// ✅ Dynamically import below-fold components
// This splits them into separate chunks that load on-demand
const LandingUpdates = dynamic(
  () => import('./components/Landing/LandingUpdates'),
  {
    loading: () => <LandingUpdatesSkeleton />,
    ssr: true // Keep SSR for SEO
  }
)

const LandingLocation = dynamic(
  () => import('./components/Landing/LandingLocation'),
  {
    loading: () => <LandingLocationSkeleton />,
    ssr: true
  }
)

// Skeleton for hero (rarely seen due to fast load)
function HeroSkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800'>
      <div className='animate-pulse'>
        <div className='h-screen bg-slate-800' />
      </div>
    </div>
  )
}

// Skeleton for Updates section
function LandingUpdatesSkeleton() {
  return (
    <div className='min-h-96 bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='animate-pulse'>
        <div className='mx-auto max-w-screen-xl px-4 py-16'>
          <div className='mb-8 h-8 w-48 rounded bg-slate-300' />
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {[1, 2, 3].map(i => (
              <div key={i} className='h-64 rounded-lg bg-slate-200' />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton for Location section
function LandingLocationSkeleton() {
  return (
    <div className='min-h-96 bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='animate-pulse'>
        <div className='mx-auto max-w-screen-xl px-4 py-16'>
          <div className='mb-8 h-8 w-64 rounded bg-slate-300' />
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <div className='h-96 rounded-lg bg-slate-200' />
            <div className='h-96 rounded-lg bg-slate-200' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div>
      {/* ✅ Hero loads immediately - it's above the fold */}
      <Suspense fallback={<HeroSkeleton />}>
        <LandingWelcome />
      </Suspense>

      {/* ✅ These components are lazy-loaded (separate chunks) */}
      {/* They won't block the initial page load */}
      <LandingUpdates />
      <LandingLocation />
    </div>
  )
}
