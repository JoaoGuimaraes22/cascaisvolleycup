import { NextIntlClientProvider, useMessages } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { AbstractIntlMessages } from 'next-intl'
import type { Metadata } from 'next'
import { pickMessages } from '@/src/lib/pickMessages'
import CompetitionHero from '../components/Competition/CompetitionHero'
import CompetitionFacts from '../components/Competition/CompetitionFacts'
import CompetitionInfo from '../components/Competition/CompetitionInfo'

export const revalidate = 86400

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'CompetitionPage.Hero' })

  return {
    title: t('title'),
    description: t('p1'),
    alternates: { canonical: `/${locale}/competition` }
  }
}

const PAGE_NAMESPACES = ['CompetitionPage']

export default function Competition() {
  const messages = useMessages()
  const pageMessages = pickMessages(
    messages as Record<string, unknown>,
    PAGE_NAMESPACES
  )

  return (
    <NextIntlClientProvider messages={pageMessages as AbstractIntlMessages}>
      <main>
        <CompetitionHero />
        <CompetitionFacts />
        <CompetitionInfo />
      </main>
    </NextIntlClientProvider>
  )
}
