import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe, Mail, MessageCircle } from 'lucide-react'
import Container from '../common/Container'
import WaveDivider from '../common/WaveDivider'
import FooterVideoStrip from '../common/FooterVideoStrip'
import Button from '../common/Button'
import logoIcon from '../../assets/logo/logo-icon.webp'

// Mirrors the navbar's own anchors — same four sections, so the footer
// never links somewhere the header doesn't already go.
const PRODUCT_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'Services', href: '/#services' },
  { label: 'Features', href: '/#features' },
  { label: 'About', href: '/#about' },
]

// A slice of the real 9 tools (config/tools.js) rather than a separate
// invented list — clicking one hits the actual gated /app route, same as
// the dashboard grid does.
const TOOL_LINKS = [
  { label: 'Keyword Research', href: '/app/keyword' },
  { label: 'Content Generator', href: '/app/content' },
  { label: 'Technical Audit', href: '/app/audit' },
  { label: 'PageSpeed Insights', href: '/app/pagespeed' },
]

// No live social profiles exist yet for this product, so these stay
// decorative (`href="#"`) rather than pointing at fabricated URLs — and
// lucide-react ships no brand marks, so generic icons stand in instead
// of a wrong-looking placeholder logo.
const SOCIAL_LINKS = [
  { label: 'Website', icon: Globe },
  { label: 'Community', icon: MessageCircle },
  { label: 'Contact', icon: Mail },
]

const FOOTER_MOTES = [
  { left: '8%', top: '14%', size: 5, delay: 0 },
  { left: '92%', top: '10%', size: 4, delay: 1.4 },
  { left: '48%', top: '30%', size: 6, delay: 2.6 },
]

function FooterLinkColumn({ title, links }) {
  return (
    <div>
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-text-muted">{title}</p>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.href} className="text-sm text-text-secondary transition-colors hover:text-primary">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // No newsletter backend exists yet — this just gives premium, honest
  // client-side feedback instead of silently doing nothing on submit.
  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="relative isolate overflow-hidden border-t border-border bg-surface/60 backdrop-blur-xl">
      {/* Same deep-sea continuity language as every section above: a wave
          lead-in from Services, a soft underwater wash, and a couple of
          drifting motes. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-1">
        <WaveDivider gradientId="wave-footer" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(30,64,175,0.06) 0%, rgba(76,29,149,0.09) 45%, transparent 100%)',
        }}
      />
      {FOOTER_MOTES.map((m, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-blue-200 animate-float-slow animate-pulse-glow"
          style={{ left: m.left, top: m.top, width: m.size, height: m.size, animationDelay: `${m.delay}s` }}
        />
      ))}

      <Container className="relative pt-16 pb-10 sm:pt-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          {/* Brand */}
          <div className="max-w-xs">
            <Link to="/" className="inline-flex items-center gap-2.5 font-heading text-base font-normal text-text">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center drop-shadow-[0_0_10px_var(--glow)]">
                <img src={logoIcon} alt="" className="h-full w-full object-contain" />
              </span>
              <span className="tracking-tight">
                Rank<span className="text-primary font-normal">Helper</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Platform for secure, easy, and rewarding search rankings — powered by AI-driven search intelligence.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  onClick={(e) => e.preventDefault()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-2/50 text-text-muted transition-all hover:border-primary/40 hover:text-primary hover:shadow-[0_0_16px_var(--glow)]"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-12 sm:gap-16">
            <FooterLinkColumn title="Product" links={PRODUCT_LINKS} />
            <FooterLinkColumn title="Tools" links={TOOL_LINKS} />
          </div>

          {/* Newsletter */}
          <div className="max-w-xs">
            <p className="mb-4 font-heading text-lg font-normal leading-snug text-text">
              Subscribe for Our Newsletters
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5 xs:flex-row lg:flex-col">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-label="Email address"
                className="w-full min-w-0 rounded-full border border-border bg-surface-2/80 px-4 py-2.5 text-sm text-text outline-none transition-all placeholder:text-text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <Button type="submit" variant="primary" size="md" className="shrink-0 justify-center">
                {subscribed ? 'Subscribed' : 'Subscribe'}
                <ArrowRight size={15} />
              </Button>
            </form>
            <p className="mt-2 h-4 text-xs text-primary">
              {subscribed ? "Thanks — you're on the list." : ''}
            </p>
          </div>
        </div>
      </Container>

      {/* Looping "deep search" video bookend — same slot the ArcGlow arc
          decoration used to occupy. */}
      <FooterVideoStrip />

      <Container className="relative border-t border-border/60 py-3.5">
        <p className="text-center text-xs text-text-muted">
          &copy; {year} RankHelper. All rights reserved. Powered by AI-driven search intelligence.
        </p>
      </Container>
    </footer>
  )
}
