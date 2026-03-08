import { NextIntlClientProvider, useMessages } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { AbstractIntlMessages } from 'next-intl'
import type { Metadata } from 'next'
import { pickMessages } from '@/src/lib/pickMessages'
import AccomodationHero from '../components/Accommodation/AccomodationHero'

export const revalidate = 86400

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'AccommodationPage.Hero' })

  return {
    title: t('title'),
    description: `${t('schools')} ${t('hotel')}`,
    alternates: { canonical: `/${locale}/accommodation` }
  }
}

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
