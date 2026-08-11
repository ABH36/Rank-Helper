import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import Container from '../../components/common/Container'
import Button from '../../components/common/Button'
import HeroSlideshow from '../../components/home/HeroSlideshow'

const PROMPT_CHIPS = [
  { icon: '⚡', label: 'Technical Audit for my site' },
  { icon: '🎯', label: 'Low competition SaaS keywords' },
  { icon: '✍️', label: 'Generate 2,000w SEO Article' },
  { icon: '📊', label: 'Analyze GSC CTR Opportunities' },
]

// The hero visual is always a dark photo background regardless of site theme, so
// this scopes the shared design tokens to fixed dark-appropriate values just for
// this section — every component (Button, chips, badge) reads the same CSS vars,
// so they render correctly here without per-component overrides.
const OVERLAY_TOKENS = {
  '--text': '#f5f7f5',
  '--text-secondary': '#c3cac4',
  '--text-muted': '#a3aca4',
  '--border': 'rgba(255,255,255,0.22)',
  '--border-strong': 'rgba(255,255,255,0.4)',
  '--surface': 'rgba(0,0,0,0.35)',
  '--surface-2': 'rgba(255,255,255,0.1)',
  '--surface-card': 'rgba(0,0,0,0.45)',
}

export default function Hero() {
  const [activePrompt, setActivePrompt] = useState(PROMPT_CHIPS[0].label)

  return (
    <section id="home" className="relative isolate flex min-h-[85vh] items-center overflow-hidden py-10 sm:min-h-screen">
      <HeroSlideshow className="absolute inset-0 -z-10 h-full w-full" />

      <Container className="relative z-10 flex flex-col items-center text-center" style={OVERLAY_TOKENS}>
        {/* Top Pill Badge */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary shadow-[0_2px_12px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <Sparkles size={14} className="animate-spin-slow text-primary" />
          <span>Next-Gen AI SEO Assistant</span>
          <span className="h-1 w-1 rounded-full bg-accent-orange" />
          <span className="text-accent-orange font-bold">2.0 Active</span>
        </div>

        {/* Main Headline */}
        <h1
          className="max-w-4xl font-heading text-3xl font-extrabold tracking-tight text-text sm:text-5xl lg:text-6xl"
          style={{ textShadow: '0 4px 24px rgba(0,0,0,0.65)' }}
        >
          Automate your SEO with an <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-primary-emerald via-primary to-accent-lime bg-clip-text text-transparent">
            AI-Powered Assistant
          </span>
        </h1>

        <p
          className="mt-3 max-w-2xl text-sm text-text-muted sm:text-lg leading-relaxed"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}
        >
          Keyword research, technical audits, AI content generation, and Google Search Console insights — experience instant, intelligent recommendations in seconds.
        </p>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap justify-center gap-3.5">
          <Button
            as={Link}
            to="/signup"
            variant="primary"
            size="lg"
            className="!shadow-[0_0_20px_var(--glow-lime),0_0_40px_var(--glow-orange)] hover:!shadow-[0_0_28px_var(--glow-lime),0_0_55px_var(--glow-orange)]"
          >
            Start Free Trial
            <ArrowRight size={18} />
          </Button>
          <Button as="a" href="#services" variant="outline" size="lg">
            Explore All 9 Tools
          </Button>
        </div>

        {/* Interactive Prompt Selector */}
        <div className="mt-5 w-full max-w-3xl">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-text-muted" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
            Click to test AI Prompts:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PROMPT_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setActivePrompt(chip.label)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                  activePrompt === chip.label
                    ? 'border-primary bg-primary/20 text-primary font-semibold shadow-sm'
                    : 'border-border bg-surface/60 text-text-muted hover:border-primary/40 hover:text-text'
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
