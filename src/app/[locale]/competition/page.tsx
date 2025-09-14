// Competition Page

import { useTranslations } from 'next-intl'
import CompetitionHero from '../components/Competition/CompetitionHero'
import CompetitionFacts from '../components/Competition/CompetitionFacts'
import CompetitionInfo from '../components/Competition/CompetitionInfo'

export default function Competition() {
  const t = useTranslations('CompetitionPage')
  return (
    <main>
      <CompetitionHero />
      <CompetitionFacts />
      <CompetitionInfo />
    </main>
  )
}
