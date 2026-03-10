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
    'Join the Cascais VolleyCup 2026 — an international indoor volleyball tournament in Cascais, Portugal. July 2026. Register now!',
  keywords: [
    'volleyball',
    'indoor volleyball',
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
      'International indoor volleyball tournament in Cascais, Portugal. July 2026.',
    url: 'https://cascaisvolley.com',
    siteName: 'Cascais VolleyCup',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/img/og-image.png',
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
      'International indoor volleyball tournament in Cascais, Portugal. July 2026.',
    images: ['/img/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  },
  icons: {
    icon: [
      { url: '/img/favicon/favicon.svg', type: 'image/svg+xml' },
      {
        url: '/img/favicon/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png'
      },
      { url: '/img/favicon/favicon.ico' }
    ],
    apple: '/img/favicon/apple-touch-icon.png'
  },
  manifest: '/img/favicon/site.webmanifest'
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
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: 'Volley4All',
                  url: 'https://cascaisvolley.com',
                  email: 'info@volley4all.com',
                  logo: 'https://cascaisvolley.com/img/global/logo-cvc.webp',
                  sameAs: []
                },
                {
                  '@type': 'SportsEvent',
                  name: 'Cascais Volley Cup 2026',
                  description:
                    'International girls volleyball tournament in Cascais, Portugal.',
                  startDate: '2026-07-01',
                  endDate: '2026-07-05',
                  eventStatus: 'https://schema.org/EventScheduled',
                  eventAttendanceMode:
                    'https://schema.org/OfflineEventAttendanceMode',
                  sport: 'Volleyball',
                  url: 'https://cascaisvolley.com',
                  image: 'https://cascaisvolley.com/img/og-image.png',
                  location: {
                    '@type': 'Place',
                    name: 'Cascais',
                    address: {
                      '@type': 'PostalAddress',
                      addressLocality: 'Cascais',
                      addressRegion: 'Lisboa',
                      addressCountry: 'PT'
                    }
                  },
                  organizer: {
                    '@type': 'Organization',
                    name: 'Volley4All',
                    url: 'https://cascaisvolley.com'
                  }
                }
              ]
            })
          }}
        />
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
