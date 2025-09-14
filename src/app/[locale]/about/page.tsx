// About Page

import { useTranslations } from 'next-intl'
import AboutHero from '../components/About/AboutHero'
import AboutPortugal from '../components/About/AboutPortugal'
import AboutVilla from '../components/About/AboutVilla'

export default function About() {
  const t = useTranslations('AboutPage')
  return (
    <main>
      <AboutHero />
      <AboutPortugal />
      <AboutVilla />
    </main>
  )
}
