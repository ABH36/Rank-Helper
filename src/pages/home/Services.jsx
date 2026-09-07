import {
  Braces,
  ClipboardCheck,
  FileCode2,
  FileText,
  Gauge,
  Link2,
  LineChart,
  Percent,
  Search,
  Tags,
  TrendingUp,
  Users,
} from 'lucide-react'
import Section from '../../components/common/Section'
import WaveDivider from '../../components/common/WaveDivider'
import TiltCard from '../../components/common/TiltCard'
import { useAuth } from '../../context/AuthContext'

// Cycled across the cards so the grid reads as colorful rather than one
// flat tone repeated twelve times — same theme-aware tokens (and same
// technique) used for the Dashboard's tool grid, kept local here since this
// is marketing-page data (12 services, 3 of them not real app tools) rather
// than the authenticated app's tool config.
const ACCENTS = [
  'var(--color-primary)',
  'var(--color-accent-orange)',
  'var(--color-primary-emerald)',
  'var(--color-accent-lime)',
  'var(--color-primary-bright)',
]

const SERVICES = [
  {
    icon: Search,
    title: 'Keyword Research',
    description: 'Intent, search volume, difficulty scoring, and AI-grouped topic clusters.',
    stat: '12,400',
    statLabel: 'keywords clustered',
  },
  {
    icon: FileText,
    title: 'Content Generator',
    description: 'Competitor-aware SERP briefs and full AI-authored articles optimized for ranking.',
    stat: '3.2x',
    statLabel: 'faster content drafts',
  },
  {
    icon: ClipboardCheck,
    title: 'Technical Audit',
    description: 'Jsoup crawler detecting broken links, missing meta tags, and H1/H2 hierarchy issues.',
    stat: '82/100',
    statLabel: 'site health score',
  },
  {
    icon: Gauge,
    title: 'PageSpeed Insights',
    description: 'Mobile and desktop performance scoring with prioritized optimization roadmap.',
    stat: '91/100',
    statLabel: 'speed score',
  },
  {
    icon: Tags,
    title: 'Meta Tag Generator',
    description: 'Generate high-CTR title tags, descriptions, and keywords with live SERP preview.',
    stat: '+18%',
    statLabel: 'average CTR',
  },
  {
    icon: Braces,
    title: 'Schema Markup',
    description: 'Generate rich-snippet valid JSON-LD structured data for any entity or page.',
    stat: '24',
    statLabel: 'rich snippets live',
  },
  {
    icon: Percent,
    title: 'On-Page Score',
    description: 'Instant 7-point audit evaluating keyword density, tags, headings, and readability.',
    stat: '76/100',
    statLabel: 'on-page score',
  },
  {
    icon: FileCode2,
    title: 'robots.txt Analyzer',
    description: 'Verifies robots.txt syntax, detects whole-site disallow blocks, and validates sitemaps.',
    stat: '0',
    statLabel: 'crawl blockers found',
  },
  {
    icon: LineChart,
    title: 'Search Console Insights',
    description: 'Actionable CTR quick wins, low-hanging fruit, and content gap analytics from live GSC.',
    stat: '+34%',
    statLabel: 'clicks this month',
  },
  {
    icon: Link2,
    title: 'Backlink Analyzer',
    description: 'Tracks new and lost backlinks, domain authority shifts, and toxic-link warnings.',
    stat: '2,340',
    statLabel: 'backlinks tracked',
  },
  {
    icon: TrendingUp,
    title: 'Rank Tracker',
    description: 'Daily rank tracking across desktop and mobile SERPs, with position-change alerts.',
    stat: '+15',
    statLabel: 'positions gained',
  },
  {
    icon: Users,
    title: 'Competitor Analysis',
    description: 'Side-by-side competitor content and backlink gap analysis to find quick wins.',
    stat: '34',
    statLabel: 'content gaps found',
  },
].map((service, i) => ({ ...service, accent: ACCENTS[i % ACCENTS.length] }))

// A few drifting motes behind the grid — same deep-sea ambience as every
// section above it.
const MOTES = [
  { left: '3%', top: '10%', size: 5, delay: 0 },
  { left: '7%', top: '80%', size: 4, delay: 1.9 },
  { left: '96%', top: '15%', size: 5, delay: 1 },
  { left: '92%', top: '85%', size: 4, delay: 2.6 },
]

function ServiceCard({ service, index }) {
  const { icon, title, description, stat, statLabel, accent } = service
  const { isAuthenticated } = useAuth()
  const target = isAuthenticated ? '/app' : '/login'

  return (
    <TiltCard icon={icon} title={title} description={description} accent={accent} index={index} to={target}>
      <div
        className="relative mt-6 flex items-baseline gap-2 border-t border-border pt-4"
        style={{ transform: 'translateZ(24px)' }}
      >
        <span className="font-heading text-xl font-normal" style={{ color: accent }}>{stat}</span>
        <span className="text-xs text-text-muted">{statLabel}</span>
      </div>
    </TiltCard>
  )
}

export default function Services() {
  return (
    <Section
      id="services"
      eyebrow="12 Powerful Tools"
      title="Complete AI Suite for Modern Search Engine Optimization"
      subtitle="Purpose-built modules designed to supercharge your research, technical health, content, and real rankings."
      className="relative overflow-hidden"
    >
      {/* Deep-sea continuity from the section above: wave lead-in, a soft
          underwater wash, and a couple of drifting motes — same language
          used on every section from the hero down. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-1">
        <WaveDivider gradientId="wave-services" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(30,64,175,0.05) 0%, rgba(76,29,149,0.07) 50%, rgba(30,64,175,0.05) 100%)',
        }}
      />
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-blue-200 animate-float-slow animate-pulse-glow"
          style={{ left: m.left, top: m.top, width: m.size, height: m.size, animationDelay: `${m.delay}s` }}
        />
      ))}

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SERVICES.map((service, i) => (
          <ServiceCard key={service.title} service={service} index={i} />
        ))}
      </div>
    </Section>
  )
}
