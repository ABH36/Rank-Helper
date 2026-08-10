import { Clock, Lock, Moon, Smartphone } from 'lucide-react'
import Section from '../../components/common/Section'
import Card from '../../components/common/Card'

const FEATURES = [
  {
    icon: Lock,
    title: 'JWT Secured',
    description: 'End-to-end token encryption — your data, Search Console OAuth, and history stay completely protected.',
  },
  {
    icon: Clock,
    title: 'Smart Wait States',
    description: 'Heavy AI runs (15-45s) render real-time progress steps, so you are never left guessing.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Experience',
    description: 'Every interface — tables, charts, audits, and AI copy editors — is optimized across all devices.',
  },
  {
    icon: Moon,
    title: 'Adaptive Light & Dark',
    description: 'Instant theme switching with system detection and per-user local storage preference persistence.',
  },
]

export default function Features() {
  return (
    <Section
      id="features"
      eyebrow="Platform Highlights"
      title="Engineered for Performance & Speed"
      subtitle="Refined UX touches designed to make daily SEO execution effortless and dependable."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="text-left group flex flex-col justify-between">
            <div>
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-[#061006]">
                <Icon size={20} />
              </span>
              <h3 className="font-heading text-base font-bold text-text">{title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}

