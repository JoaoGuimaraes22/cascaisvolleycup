import { NextIntlClientProvider, useMessages } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { AbstractIntlMessages } from 'next-intl'
import type { Metadata } from 'next'
import { pickMessages } from '@/src/lib/pickMessages'
import HallOfFameHero from '../components/HallOfFame/HallOfFameHero'
import HallOfFameParticipants from '../components/HallOfFame/HallOfFameParticipants'
import HallOfFameWinners from '../components/HallOfFame/HallOfFameWinners'

export const revalidate = 86400

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'HallOfFamePage.Hero' })

  return {
    title: t('title'),
    description: t('intro'),
    alternates: { canonical: `/${locale}/hall-of-fame` }
  }
}

const PAGE_NAMESPACES = ['HallOfFamePage']

export default function HallOfFamePage() {
  const messages = useMessages()
  const pageMessages = pickMessages(
    messages as Record<string, unknown>,
    PAGE_NAMESPACES
  )

  return (
    <NextIntlClientProvider messages={pageMessages as AbstractIntlMessages}>
      <div>
        <HallOfFameHero />
        <HallOfFameParticipants />
        <HallOfFameWinners />
      </div>
    </NextIntlClientProvider>
  )
}
