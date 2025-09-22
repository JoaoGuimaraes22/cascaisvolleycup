import type { Metadata } from 'next'
import {
  AbstractIntlMessages,
  NextIntlClientProvider,
  useMessages
} from 'next-intl'
import { Inter, Rubik, Space_Grotesk } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from './components/Global/Header'
import Footer from './components/Global/Footer'
import ScrollToTopButton from './components/Global/ScrollToTopButton'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--inter' })
const rubik = Rubik({ subsets: ['arabic'], variable: '--rubik' })
const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

export const metadata: Metadata = {
  title: 'Cascais VolleyCup 2026',
  description: 'Your next summer tournament!',
  icons: { icon: '/img/icon/icon.svg' }
}

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = useMessages()

  return (
    <html
      lang={locale}
      className={`${space_grotesk.variable} ${rubik.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className='flex min-h-screen flex-col overflow-x-hidden pt-[var(--header-h)]'>
        <NextIntlClientProvider
          locale={locale}
          messages={messages as AbstractIntlMessages}
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

          {/* Fixed header (measures itself and updates --header-h) */}
          <Header locale={locale} />

          {/* Content sits below the header thanks to body padding */}
          <main className='w-full flex-1'>{children}</main>

          <Footer locale={locale} />
          <ScrollToTopButton />
        </NextIntlClientProvider>

        {/* Add Vercel Analytics */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
