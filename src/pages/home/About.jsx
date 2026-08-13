import { ShieldCheck, Target, Zap } from 'lucide-react'
import Section from '../../components/common/Section'
import Card from '../../components/common/Card'
import RevealBox from '../../components/common/RevealBox'

const POINTS = [
  {
    icon: Target,
    title: 'Built for real results',
    description:
      'Every tool is grounded in live data — crawls, PageSpeed metrics and your real Search Console performance numbers.',
  },
  {
    icon: Zap,
    title: 'AI where it matters',
    description:
      'Keyword clustering, content briefs and fix suggestions are AI-assisted, so you spend time executing, not guessing.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Enterprise Grade',
    description:
      'Every API call is JWT authenticated end-to-end, and your Search Console OAuth tokens remain securely encrypted.',
  },
]

export default function About() {
  return (
    <Section
      id="about"
      eyebrow="AI-Powered Workflow"
      title="One unified dashboard for your entire SEO strategy"
      subtitle="From preliminary keyword discovery to tracking live Search Console performance, experience seamless automation."
      className="relative overflow-hidden"
    >
      <div className="relative z-10 grid gap-6 sm:grid-cols-3">
        {POINTS.map(({ icon: Icon, title, description }, i) => (
          <RevealBox key={title} direction="fade-up" delay={i * 0.12}>
            <Card className="text-left group card-hover-premium h-full">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm transition-transform group-hover:scale-110 group-hover:bg-primary/20">
                <Icon size={22} />
              </span>
              <h3 className="font-heading text-lg font-normal text-text">{title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
            </Card>
          </RevealBox>
        ))}
      </div>
    </Section>
  )
}
