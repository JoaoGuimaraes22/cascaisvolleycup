// OPTIMIZED Landing Page - Skeletons WITHOUT dynamic imports
// src/app/[locale]/page.tsx

import { Suspense } from 'react'
import LandingWelcome from './components/Landing/LandingWelcome'
import LandingUpdates from './components/Landing/LandingUpdates'
import LandingLocation from './components/Landing/LandingLocation'

// ✅ Hero Skeleton - Dark (matches dark hero background)
function HeroSkeleton() {
  return (
    <div className='relative min-h-screen bg-gradient-to-br from-slate-900 to-slate-800'>
      <div className='animate-pulse'>
        <div className='flex min-h-screen items-center justify-center'>
          <div className='space-y-8 text-center'>
            {/* Logo placeholder */}
            <div className='mx-auto h-64 w-64 rounded-lg bg-slate-700/50 md:h-80 md:w-80' />
            {/* Tagline placeholder */}
            <div className='mx-auto h-16 w-80 rounded-lg bg-slate-700/50 md:w-96' />
            {/* Buttons placeholder */}
            <div className='flex justify-center gap-4'>
              <div className='h-12 w-40 rounded-full bg-slate-700/50' />
              <div className='h-12 w-40 rounded-full bg-slate-700/50' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ Updates Skeleton - Light (matches actual section)
function UpdatesSkeleton() {
  return (
    <div className='relative min-h-96 bg-white'>
      <div className='animate-pulse'>
        <div className='mx-auto max-w-screen-xl px-4 py-16'>
          <div className='mb-8 h-8 w-48 rounded bg-slate-200' />
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[1, 2, 3].map(i => (
              <div key={i} className='space-y-4 rounded-xl bg-slate-100 p-6'>
                <div className='h-6 w-3/4 rounded bg-slate-200' />
                <div className='h-4 w-full rounded bg-slate-200' />
                <div className='h-4 w-5/6 rounded bg-slate-200' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ Location Skeleton - Light (matches actual section)
function LocationSkeleton() {
  return (
    <div className='relative min-h-96 bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='animate-pulse'>
        <div className='mx-auto max-w-screen-xl px-4 py-16'>
          <div className='mb-8 h-8 w-64 rounded bg-slate-200' />
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <div className='space-y-4'>
              <div className='h-4 w-full rounded bg-slate-200' />
              <div className='h-4 w-5/6 rounded bg-slate-200' />
              <div className='h-4 w-4/5 rounded bg-slate-200' />
            </div>
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
      {/* Hero with skeleton - NO dynamic import */}
      <Suspense fallback={<HeroSkeleton />}>
        <LandingWelcome />
      </Suspense>

      {/* Updates with skeleton - NO dynamic import */}
      <Suspense fallback={<UpdatesSkeleton />}>
        <LandingUpdates />
      </Suspense>

      {/* Location with skeleton - NO dynamic import */}
      <Suspense fallback={<LocationSkeleton />}>
        <LandingLocation />
      </Suspense>
    </div>
  )
}
