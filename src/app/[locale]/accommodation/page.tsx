import { NextIntlClientProvider, useMessages } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import { pickMessages } from '@/src/lib/pickMessages'
import AccomodationHero from '../components/Accommodation/AccomodationHero'

export const revalidate = 86400

const PAGE_NAMESPACES = ['AccommodationPage', 'ContactModal']

export default function Accommodation() {
  const messages = useMessages()
  const pageMessages = pickMessages(
    messages as Record<string, unknown>,
    PAGE_NAMESPACES
  )

  return (
    <NextIntlClientProvider messages={pageMessages as AbstractIntlMessages}>
      <main>
        <AccomodationHero />
      </main>
    </NextIntlClientProvider>
  )
}
