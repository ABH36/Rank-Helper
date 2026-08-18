import {
  Braces, ClipboardCheck, FileCode2, FileText, Gauge, LineChart, Percent, Search, Tags,
} from 'lucide-react'

// The 9 real backend tools (Keyword/Content/Audit/PageSpeed/MetaTag/Schema/
// OnPage/Robots/Gsc) — shared between AppLayout's sidebar and Dashboard's
// tool grid so the two never drift out of sync.
// Cycled across the tool cards so the Dashboard grid reads as colorful
// rather than one flat tone repeated nine times — all five are theme-aware
// CSS custom properties (see index.css), so they adapt in light/dark
// automatically instead of needing separate hardcoded hex per theme.
const ACCENTS = [
  'var(--color-primary)',
  'var(--color-accent-orange)',
  'var(--color-primary-emerald)',
  'var(--color-accent-lime)',
  'var(--color-primary-bright)',
]

export const APP_NAV_ITEMS = [
  {
    icon: Search,
    title: 'Keyword Research',
    description: 'Intent, search volume, difficulty scoring, and AI-grouped topic clusters.',
    route: '/app/keyword',
    accent: ACCENTS[0],
  },
  {
    icon: FileText,
    title: 'Content Generator',
    description: 'Competitor-aware SERP briefs and full AI-authored articles optimized for ranking.',
    route: '/app/content',
    accent: ACCENTS[1],
  },
  {
    icon: ClipboardCheck,
    title: 'Technical Audit',
    description: 'Jsoup crawler detecting broken links, missing meta tags, and H1/H2 hierarchy issues.',
    route: '/app/audit',
    accent: ACCENTS[2],
  },
  {
    icon: Gauge,
    title: 'PageSpeed Insights',
    description: 'Mobile and desktop performance scoring with prioritized optimization roadmap.',
    route: '/app/pagespeed',
    accent: ACCENTS[3],
  },
  {
    icon: Tags,
    title: 'Meta Tag Generator',
    description: 'Generate high-CTR title tags, descriptions, and keywords with live SERP preview.',
    route: '/app/meta-tags',
    accent: ACCENTS[4],
  },
  {
    icon: Braces,
    title: 'Schema Markup',
    description: 'Generate rich-snippet valid JSON-LD structured data for any entity or page.',
    route: '/app/schema',
    accent: ACCENTS[0],
  },
  {
    icon: Percent,
    title: 'On-Page Score',
    description: 'Instant 7-point audit evaluating keyword density, tags, headings, and readability.',
    route: '/app/onpage',
    accent: ACCENTS[1],
  },
  {
    icon: FileCode2,
    title: 'robots.txt Analyzer',
    description: 'Verifies robots.txt syntax, detects whole-site disallow blocks, and validates sitemaps.',
    route: '/app/robots',
    accent: ACCENTS[2],
  },
  {
    icon: LineChart,
    title: 'Search Console Insights',
    description: 'Actionable CTR quick wins, low-hanging fruit, and content gap analytics from live GSC.',
    route: '/app/gsc',
    accent: ACCENTS[3],
  },
]
