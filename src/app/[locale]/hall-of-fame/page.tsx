// Hall of Fame page

import { useTranslations } from 'next-intl'
import HallOfFameHero from '../components/HallOfFame/HallOfFameHero'
import HallOfFameParticipants from '../components/HallOfFame/HallOfFameParticipants'
import HallOfFameWinners from '../components/HallOfFame/HallOfFameWinners'

export default function HallOfFamePage() {
  const t = useTranslations('HallOfFamePage')
  return (
    <div>
      <HallOfFameHero />
      <HallOfFameParticipants />
      <HallOfFameWinners />
    </div>
  )
}
