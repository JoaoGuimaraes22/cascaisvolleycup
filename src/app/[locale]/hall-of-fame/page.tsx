import { NextIntlClientProvider, useMessages } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import { pickMessages } from '@/src/lib/pickMessages'
import HallOfFameHero from '../components/HallOfFame/HallOfFameHero'
import HallOfFameParticipants from '../components/HallOfFame/HallOfFameParticipants'
import HallOfFameWinners from '../components/HallOfFame/HallOfFameWinners'

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
