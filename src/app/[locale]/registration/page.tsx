import { NextIntlClientProvider, useMessages } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import { pickMessages } from '@/src/lib/pickMessages'
import RegistrationHero from '../components/Registration/RegistrationHero'
import RegistrationForm from '../components/Registration/RegistrationForm'

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
