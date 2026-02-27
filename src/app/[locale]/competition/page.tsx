import { NextIntlClientProvider, useMessages } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import { pickMessages } from '@/src/lib/pickMessages'
import CompetitionHero from '../components/Competition/CompetitionHero'
import CompetitionFacts from '../components/Competition/CompetitionFacts'
import CompetitionInfo from '../components/Competition/CompetitionInfo'

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
