import {
  ArrowUpRight,
  Braces,
  ClipboardCheck,
  FileCode2,
  FileText,
  Gauge,
  LineChart,
  Percent,
  Search,
  Sparkles,
  Tags,
} from 'lucide-react'
import Section from '../../components/common/Section'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import RevealBox from '../../components/common/RevealBox'

const SERVICES = [
  {
    icon: Search,
    title: 'Keyword Research',
    tag: 'Clustering',
    variant: 'emerald',
    description: 'Intent, search volume, difficulty scoring, and AI-grouped topic clusters.',
  },
  {
    icon: FileText,
    title: 'Content Generator',
    tag: 'AI Article',
    variant: 'lime',
    description: 'Competitor-aware SERP briefs and full AI-authored articles optimized for ranking.',
  },
  {
    icon: ClipboardCheck,
    title: 'Technical Audit',
    tag: 'Site Crawl',
    variant: 'slate',
    description: 'Jsoup crawler detecting broken links, missing meta tags, and H1/H2 hierarchy issues.',
  },
  {
    icon: Gauge,
    title: 'PageSpeed Insights',
    tag: 'Core Vitals',
    variant: 'emerald',
    description: 'Mobile and desktop performance scoring with prioritized optimization roadmap.',
  },
  {
    icon: Tags,
    title: 'Meta Tag Generator',
    tag: 'AI Assist',
    variant: 'lime',
    description: 'Generate high-CTR title tags, descriptions, and keywords with live SERP preview.',
  },
  {
    icon: Braces,
    title: 'Schema Markup',
    tag: 'JSON-LD',
    variant: 'slate',
    description: 'Generate rich-snippet valid JSON-LD structured data for any entity or page.',
  },
  {
    icon: Percent,
    title: 'On-Page Score',
    tag: '7-Point Check',
    variant: 'emerald',
    description: 'Instant 7-point audit evaluating keyword density, tags, headings, and readability.',
  },
  {
    icon: FileCode2,
    title: 'robots.txt Analyzer',
    tag: 'Crawl Safety',
    variant: 'lime',
    description: 'Verifies robots.txt syntax, detects whole-site disallow blocks, and validates sitemaps.',
  },
  {
    icon: LineChart,
    title: 'Search Console Insights',
    tag: 'GSC Integration',
    variant: 'slate',
    description: 'Actionable CTR quick wins, low-hanging fruit, and content gap analytics from live GSC.',
  },
]

export default function Services() {
  return (
    <Section
      id="services"
      eyebrow="9 Powerful Tools"
      title="Complete AI Suite for Modern Search Engine Optimization"
      subtitle="Purpose-built modules designed to supercharge your research, technical health, content, and real rankings."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ icon: Icon, title, tag, variant, description }, i) => (
          <RevealBox
            key={title}
            direction="fade-up"
            delay={i * 0.07}
            threshold={0.08}
          >
            <Card
              className="group relative flex flex-col justify-between text-left transition-all duration-300 hover:border-primary/50 card-hover-premium h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-[#061006]">
                    <Icon size={20} />
                  </span>
                  <Badge variant={variant}>{tag}</Badge>
                </div>

                <h3 className="font-heading text-lg font-normal text-text flex items-center justify-between">
                  <span>{title}</span>
                  <ArrowUpRight size={18} className="text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </h3>

                <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-normal text-primary opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex items-center gap-1">
                  <Sparkles size={12} />
                  Launch Tool
                </span>
                <span>→</span>
              </div>
            </Card>
          </RevealBox>
        ))}
      </div>
    </Section>
  )
}
