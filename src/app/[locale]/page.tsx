import LandingWelcome from './components/Landing/LandingWelcome'
import LandingUpdates from './components/Landing/LandingUpdates'
import LandingLocation from './components/Landing/LandingLocation'

export default function DashboardPage() {
  return (
    <div>
      <LandingWelcome />
      <LandingUpdates />
      <LandingLocation />
    </div>
  )
}
