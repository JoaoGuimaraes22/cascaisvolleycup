// About Page

import { useTranslations } from 'next-intl'
import AccomodationHero from '../components/Accommodation/AccomodationHero'

export default function Accommodation() {
  const t = useTranslations('AccommodationPage')
  return (
    <main>
      <AccomodationHero />
    </main>
  )
}
