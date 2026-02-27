// src/app/[locale]/layout.tsx
import type { Metadata } from 'next'
import {
  AbstractIntlMessages,
  NextIntlClientProvider,
  useMessages
} from 'next-intl'
import { Rubik, Space_Grotesk } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from './components/Global/Header'
import Footer from './components/Global/Footer'
import ScrollToTopButton from './components/Global/ScrollToTopButton'
import { pickMessages } from '@/src/lib/pickMessages'
import './globals.css'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial'],
  weight: ['400', '700']
})

const rubik = Rubik({
  subsets: ['arabic'],
  variable: '--rubik',
  display: 'swap',
  preload: false,
  adjustFontFallback: true
})

export const metadata: Metadata = {
  title: 'Cascais VolleyCup 2026',
  description: 'Your next summer tournament!',
  icons: { icon: '/img/icon/icon.svg' }
}

// ✅ Only the namespaces used by layout-level client components
const LAYOUT_NAMESPACES = ['Header', 'Footer']

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = useMessages()
  const layoutMessages = pickMessages(
    messages as Record<string, unknown>,
    LAYOUT_NAMESPACES
  )

  return (
    <html
      lang={locale}
      className={`${space_grotesk.variable} ${rubik.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link rel='preconnect' href='https://res.cloudinary.com' />
        <link rel='dns-prefetch' href='https://res.cloudinary.com' />
      </head>

      <body className='flex min-h-screen flex-col overflow-x-hidden pt-[var(--header-h)]'>
        <NextIntlClientProvider
          locale={locale}
          messages={layoutMessages as AbstractIntlMessages}
        >
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
          <Header locale={locale} />
          <main className='w-full flex-1'>{children}</main>
          <Footer locale={locale} />
          <ScrollToTopButton />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
