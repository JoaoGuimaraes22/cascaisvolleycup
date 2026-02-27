import { NextIntlClientProvider, useMessages } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import { pickMessages } from '@/src/lib/pickMessages'
import AboutHero from '../components/About/AboutHero'
import AboutPortugal from '../components/About/AboutPortugal'
import AboutVilla from '../components/About/AboutVilla'

const PAGE_NAMESPACES = ['AboutPage']

export default function About() {
  const messages = useMessages()
  const pageMessages = pickMessages(
    messages as Record<string, unknown>,
    PAGE_NAMESPACES
  )

  return (
    <NextIntlClientProvider messages={pageMessages as AbstractIntlMessages}>
      <main>
        <AboutHero />
        <AboutPortugal />
        <AboutVilla />
      </main>
    </NextIntlClientProvider>
  )
}
