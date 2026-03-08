import { NextIntlClientProvider, useMessages } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { AbstractIntlMessages } from 'next-intl'
import type { Metadata } from 'next'
import { pickMessages } from '@/src/lib/pickMessages'
import ProgramHero from '../components/Program/ProgramHero'

export const revalidate = 86400

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'ProgramPage.Hero' })

  return {
    title: t('title'),
    description: `Cascais Volley Cup 2026 — ${t('title')}. ${t('checkin')}, ${t('checkout')}.`,
    alternates: { canonical: `/${locale}/program` }
  }
}

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
