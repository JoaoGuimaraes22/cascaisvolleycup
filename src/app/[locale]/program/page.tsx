import { NextIntlClientProvider, useMessages } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import { pickMessages } from '@/src/lib/pickMessages'
import ProgramHero from '../components/Program/ProgramHero'

const PAGE_NAMESPACES = ['ProgramPage']

export default function ProgramPage() {
  const messages = useMessages()
  const pageMessages = pickMessages(
    messages as Record<string, unknown>,
    PAGE_NAMESPACES
  )

  return (
    <NextIntlClientProvider messages={pageMessages as AbstractIntlMessages}>
      <div>
        <ProgramHero />
      </div>
    </NextIntlClientProvider>
  )
}
