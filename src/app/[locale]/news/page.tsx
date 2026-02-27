import { NextIntlClientProvider, useMessages } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import { pickMessages } from '@/src/lib/pickMessages'

// This page uses root-level translation key — adjust once proper namespace is added
const PAGE_NAMESPACES = ['NewsPage']

export default function NewsPage() {
  const messages = useMessages()
  const pageMessages = pickMessages(
    messages as Record<string, unknown>,
    PAGE_NAMESPACES
  )

  return (
    <NextIntlClientProvider messages={pageMessages as AbstractIntlMessages}>
      <div className='px-32 py-24 text-center text-2xl'>Coming soon</div>
    </NextIntlClientProvider>
  )
}
