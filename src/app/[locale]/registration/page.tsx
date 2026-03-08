import { NextIntlClientProvider, useMessages } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { AbstractIntlMessages } from 'next-intl'
import type { Metadata } from 'next'
import { pickMessages } from '@/src/lib/pickMessages'
import RegistrationHero from '../components/Registration/RegistrationHero'
import RegistrationForm from '../components/Registration/RegistrationForm'

export const revalidate = 3600 // Hourly — in case registration details change

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'RegistrationPage.RegistrationHero' })

  return {
    title: t('title'),
    description: `${t('title')} — Cascais Volley Cup 2026. Cascais, Portugal.`,
    alternates: { canonical: `/${locale}/registration` }
  }
}

// ContactModal needed because RegistrationHero renders ContactToast
const PAGE_NAMESPACES = ['RegistrationPage', 'ContactModal']

export default function Registration() {
  const messages = useMessages()
  const pageMessages = pickMessages(
    messages as Record<string, unknown>,
    PAGE_NAMESPACES
  )

  return (
    <NextIntlClientProvider messages={pageMessages as AbstractIntlMessages}>
      <div>
        <RegistrationHero />
        <RegistrationForm />
      </div>
    </NextIntlClientProvider>
  )
}
