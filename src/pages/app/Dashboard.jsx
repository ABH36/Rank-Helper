import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { APP_NAV_ITEMS } from '../../config/tools'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

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

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {APP_NAV_ITEMS.map(({ icon: Icon, title, description, route, accent }) => (
          <Card key={route} className="relative flex flex-col justify-between overflow-hidden">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1"
              style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
            />
            <div>
              <span
                className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)`, color: accent }}
              >
                <Icon size={20} />
              </span>
              <h3 className="font-heading text-lg font-normal text-text">{title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
            </div>
            <Button as={Link} to={route} variant="secondary" size="sm" className="mt-6 w-fit">
              Open
              <ArrowRight size={15} />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
