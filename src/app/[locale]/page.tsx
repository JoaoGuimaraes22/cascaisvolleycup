// FULLY PRELOADED Landing Page - Everything loads upfront, no scroll jank
// src/app/[locale]/page.tsx

import { Suspense } from 'react'
import LandingWelcome from './components/Landing/LandingWelcome'
import LandingUpdates from './components/Landing/LandingUpdates'
import LandingLocation from './components/Landing/LandingLocation'

// Simple loading fallback
function LandingPageSkeleton() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='animate-pulse'>
        {/* Hero skeleton */}
        <div className='h-screen bg-slate-200' />
        {/* Updates skeleton */}
        <div className='h-96 bg-slate-300' />
        {/* Location skeleton */}
        <div className='h-96 bg-slate-200' />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LandingPageSkeleton />}>
      <div>
        <LandingWelcome />
        <LandingUpdates />
        <LandingLocation />
      </div>
    </Suspense>
  )
}
