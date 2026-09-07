import {
  Braces, ClipboardCheck, FileCode2, FileText, Gauge, LineChart, Percent, Search, Tags,
} from 'lucide-react'
import WaveDivider from './WaveDivider'

// The product's own 9 real tools (matches Backend/Seo's actual API
// controllers — Keyword/Content/Audit/PageSpeed/MetaTag/Schema/OnPage/
// Robots/Gsc — not third-party competitor names).
const TOOLS = [
  { name: 'Keyword Research', icon: Search },
  { name: 'Content Generator', icon: FileText },
  { name: 'Technical Audit', icon: ClipboardCheck },
  { name: 'PageSpeed Insights', icon: Gauge },
  { name: 'Meta Tag Generator', icon: Tags },
  { name: 'Schema Markup', icon: Braces },
  { name: 'On-Page SEO Score', icon: Percent },
  { name: 'robots.txt Analyzer', icon: FileCode2 },
  { name: 'Search Console Insights', icon: LineChart },
]

// We duplicate the list so the CSS loop looks seamless
const TRACK = [...TOOLS, ...TOOLS]

// A few slow-drifting motes, same idea as the hero's bubbles — pure
// ambience, reinforcing "this strip is underwater too" without competing
// with the marquee for attention.
const MOTES = [
  { left: '8%', size: 4, delay: 0 },
  { left: '28%', size: 5, delay: 1.4 },
  { left: '52%', size: 4, delay: 0.7 },
  { left: '74%', size: 5, delay: 2.1 },
  { left: '91%', size: 4, delay: 1 },
]

export default function LogoMarquee({ className = '' }) {
  return (
    <div className={`relative overflow-hidden py-6 ${className}`}>
      {/* Deep-sea wash behind the whole strip — a horizontal band of the
          same blue-violet the hero's bubbles use, so this reads as its own
          "underwater" section rather than a plain bordered bar. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(30,64,175,0.08) 0%, rgba(76,29,149,0.1) 50%, rgba(30,64,175,0.08) 100%)',
        }}
      />

      {/* Wavy top/bottom edges instead of flat border-y rules — sit just
          inside the strip's own edge (not pushed outside via translate)
          since the parent clips overflow, which would hide anything
          positioned beyond its own box. */}
      <div className="absolute inset-x-0 top-0 z-1">
        <WaveDivider gradientId="wave-top" />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-1">
        <WaveDivider flip gradientId="wave-bottom" />
      </div>

      {/* Rising motes drifting up through the strip */}
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="pointer-events-none absolute bottom-2 rounded-full bg-blue-200 animate-float-slow animate-pulse-glow"
          style={{ left: m.left, width: m.size, height: m.size, animationDelay: `${m.delay}s` }}
        />
      ))}

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-bg to-transparent" />

      {/* Label */}
      <p className="relative mb-4 text-center text-xs font-normal uppercase tracking-widest text-text-muted">
        One suite, nine powerful tools
      </p>

      {/* Scrolling track */}
      <div
        className="relative flex gap-4"
        style={{
          animation: 'marqueeScroll 28s linear infinite',
          width: 'max-content',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {TRACK.map(({ name, icon: Icon }, i) => (
          <div
            key={`${name}-${i}`}
            className="flex shrink-0 items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-normal text-text-secondary shadow-sm backdrop-blur-sm transition-all hover:text-primary"
            style={{
              // Same glass-bubble language as the hero's small bubbles — a
              // round highlight in the upper-left fading to a deeper
              // blue-violet, so these chips read as part of the same
              // "underwater glass" family rather than a generic pill.
              background:
                'radial-gradient(circle at 25% 22%, rgba(224,242,254,0.32) 0%, rgba(96,165,250,0.16) 35%, rgba(76,29,149,0.2) 100%)',
              border: '1px solid rgba(191,219,254,0.28)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 16px -2px rgba(96,165,250,0.5)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '' }}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Icon size={13} />
            </span>
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
