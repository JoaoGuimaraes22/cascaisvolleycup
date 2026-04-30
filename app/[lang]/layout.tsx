import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { notFound } from 'next/navigation'
import { i18n } from '@/i18n-config'
import { getDictionary, hasLocale } from './dictionaries'
import { SITE_URL, bcp47Locale, schemaIds, buildPageMetadata } from './_lib/seo'
import JsonLd from './_components/json-ld'
import Header from './_components/global/header'
import Footer from './_components/global/footer'
import ScrollToTopButton from './_components/global/scroll-to-top-button'
import '../globals.css'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  weight: ['400', '700']
})

export const viewport: Viewport = {
  themeColor: '#333366'
}

export async function generateStaticParams() {
  return i18n.locales.map(lang => ({ lang }))
}

export async function generateMetadata({
  params
}: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params

  if (!hasLocale(lang)) return {}

  const dict = await getDictionary(lang)
  const { title, description, name, titleTemplate, keywords } = dict.metadata

  const base = buildPageMetadata(lang, { title, description, path: '' })

  return {
    ...base,
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: titleTemplate },
    keywords,
    authors: [{ name: 'Volley4All', url: SITE_URL }],
    openGraph: { ...base.openGraph, siteName: name },
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
    manifest: '/img/favicon/site.webmanifest',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}

export default async function RootLayout({
  children,
  params
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params

  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const ids = schemaIds(lang)

  const websiteNode = {
    '@type': 'WebSite',
    '@id': ids.website,
    url: `${SITE_URL}/${lang}`,
    name: dict.metadata.name,
    description: dict.metadata.description,
    inLanguage: bcp47Locale(lang),
    publisher: { '@id': ids.organization }
  }

  const organizationNode = {
    '@type': 'Organization',
    '@id': ids.organization,
    name: 'Volley4All',
    url: SITE_URL,
    email: 'info@volley4all.com',
    logo: `${SITE_URL}/img/global/logo-cvc.webp`
  }

  const sportsEventNode = {
    '@type': 'SportsEvent',
    '@id': ids.event,
    name: dict.metadata.name,
    description: dict.metadata.description,
    startDate: '2026-07-01',
    endDate: '2026-07-05',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    sport: 'Volleyball',
    url: `${SITE_URL}/${lang}`,
    image: `${SITE_URL}/img/og-image.png`,
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
    organizer: { '@id': ids.organization }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [websiteNode, organizationNode, sportsEventNode]
  }

  return (
    <html
      lang={lang}
      className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link rel='preconnect' href='https://res.cloudinary.com' />
        <link rel='dns-prefetch' href='https://res.cloudinary.com' />
        <JsonLd data={jsonLd} />
      </head>
      <body className='flex min-h-screen flex-col overflow-x-hidden pt-[var(--header-h)]'>
        <a
          href='#main'
          className='focus:text-primary sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2'
        >
          {dict.ui.skipToContent}
        </a>
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
        <Header lang={lang} dict={dict.Header} localeNames={dict.localeNames} />
        <main id='main' className='w-full flex-1'>
          {children}
        </main>
        <Footer lang={lang} dict={dict.Footer} />
        <ScrollToTopButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
