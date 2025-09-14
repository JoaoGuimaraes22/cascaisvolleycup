// Registration Page

import { useTranslations } from 'next-intl'
import RegistrationHero from '../components/Registration/RegistrationHero'
import RegistrationForm from '../components/Registration/RegistrationForm'

export default function About() {
  const t = useTranslations('RegistrationPage')
  return (
    <div>
      <RegistrationHero />
      <RegistrationForm />
    </div>
  )
}
