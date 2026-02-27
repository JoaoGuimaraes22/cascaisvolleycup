// src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from 'next'
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

export const viewport: Viewport = {
  themeColor: '#333366'
}

export const metadata: Metadata = {
  title: {
    default: 'Cascais VolleyCup 2026',
    template: '%s | Cascais VolleyCup 2026'
  },
  description:
    'Join the Cascais VolleyCup 2026 — an international beach volleyball tournament in Cascais, Portugal. July 2026. Register now!',
  keywords: [
    'volleyball',
    'beach volleyball',
    'Cascais',
    'Portugal',
    'tournament',
    'VolleyCup',
    '2026',
    'voleibol'
  ],
  authors: [{ name: 'Volley4All', url: 'https://cascaisvolley.com' }],
  metadataBase: new URL('https://cascaisvolley.com'),
  alternates: {
    canonical: '/',
    languages: {
      en: '/en',
      pt: '/pt',
      es: '/es',
      fr: '/fr'
    }
  },
  openGraph: {
    title: 'Cascais VolleyCup 2026',
    description:
      'International beach volleyball tournament in Cascais, Portugal. July 2026.',
    url: 'https://cascaisvolley.com',
    siteName: 'Cascais VolleyCup',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/img/og-image.jpg', // create a 1200x630px image
        width: 1200,
        height: 630,
        alt: 'Cascais VolleyCup 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cascais VolleyCup 2026',
    description:
      'International beach volleyball tournament in Cascais, Portugal. July 2026.',
    images: ['/img/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  },
  icons: {
    icon: [
      { url: '/img/icon/icon.svg', type: 'image/svg+xml' },
      { url: '/img/icon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/icon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/img/icon/favicon.ico' }
    ],
    apple: '/img/icon/favicon-180x180.png'
  }
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
