import { ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { APP_NAV_ITEMS } from '../../config/tools'
import TiltCard from '../../components/common/TiltCard'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="font-heading text-2xl font-normal text-text sm:text-3xl">
        Welcome back{user?.username ? `, ${user.username}` : ''}
      </h1>
      <p className="mt-1.5 text-text-muted">
        {APP_NAV_ITEMS.length} SEO tools ready to use — pick one to get started.
      </p>

      {/* Same premium 3D-tilt glass cards as the marketing Services grid —
          the whole card is the link, so the "Open" affordance below is a
          plain pill (not a nested anchor) that rides the card's own hover
          state rather than duplicating Button.jsx's separate hover logic. */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {APP_NAV_ITEMS.map(({ icon, title, description, route, accent }, index) => (
          <TiltCard key={route} icon={icon} title={title} description={description} accent={accent} index={index} to={route}>
            <div className="relative mt-6 border-t border-border pt-4" style={{ transform: 'translateZ(24px)' }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-xs font-normal text-text transition-all duration-300 group-hover:bg-primary/20 group-hover:text-primary">
                Open
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  )
}
