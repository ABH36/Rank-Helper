import { Clock, Lock, Moon, Smartphone } from 'lucide-react'
import Section from '../../components/common/Section'
import Card from '../../components/common/Card'
import RevealBox from '../../components/common/RevealBox'
import WaveDivider from '../../components/common/WaveDivider'

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

// A few drifting motes behind the grid — same deep-sea ambience as every
// other section on the page.
const MOTES = [
  { left: '4%', top: '18%', size: 5, delay: 0 },
  { left: '95%', top: '75%', size: 4, delay: 1.6 },
  { left: '90%', top: '12%', size: 4, delay: 0.8 },
]

export default function Features() {
  return (
    <Section
      id="features"
      eyebrow="Platform Highlights"
      title="Engineered for Performance & Speed"
      subtitle="Refined UX touches designed to make daily SEO execution effortless and dependable."
      className="relative overflow-hidden"
    >
      {/* Deep-sea continuity from the section above: wave lead-in, a soft
          underwater wash, and a couple of drifting motes — same language
          used on every section from the hero down. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-1">
        <WaveDivider gradientId="wave-features" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(76,29,149,0.06) 0%, rgba(30,64,175,0.05) 50%, rgba(76,29,149,0.06) 100%)',
        }}
      />
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-blue-200 animate-float-slow animate-pulse-glow"
          style={{ left: m.left, top: m.top, width: m.size, height: m.size, animationDelay: `${m.delay}s` }}
        />
      ))}

      <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description }, i) => (
          <RevealBox
            key={title}
            direction={i % 2 === 0 ? 'fade-left' : 'fade-right'}
            delay={i * 0.1}
          >
            <Card className="text-left group flex flex-col justify-between card-hover-premium h-full">
              <div>
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary">
                  <Icon size={20} />
                </span>
                <h3 className="font-heading text-base font-normal text-text">{title}</h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
              </div>
            </Card>
          </RevealBox>
        ))}
      </div>
    </Section>
  )
}
