// src/app/[locale]/page.tsx
import dynamic from 'next/dynamic'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import { pickMessages } from '@/src/lib/pickMessages'
import LandingWelcome from './components/Landing/LandingWelcome'

const LandingUpdates = dynamic(
  () => import('./components/Landing/LandingUpdates'),
  {
    loading: () => (
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
)

const LandingLocation = dynamic(
  () => import('./components/Landing/LandingLocation'),
  {
    loading: () => (
      <div className='relative min-h-96 bg-white'>
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
)

// ✅ Only namespaces used by this page's client components
const PAGE_NAMESPACES = ['LandingPage', 'RegistrationPage']

export default function DashboardPage() {
  const messages = useMessages()
  const pageMessages = pickMessages(
    messages as Record<string, unknown>,
    PAGE_NAMESPACES
  )

  return (
    <NextIntlClientProvider messages={pageMessages as AbstractIntlMessages}>
      <div className='bg-white'>
        <LandingWelcome />
        <LandingUpdates />
        <LandingLocation />
      </div>
    </NextIntlClientProvider>
  )
}
