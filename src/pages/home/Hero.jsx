import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bot, CheckCircle2, ChevronRight, CornerDownLeft, Sparkles, Zap } from 'lucide-react'
import Container from '../../components/common/Container'
import Button from '../../components/common/Button'

const PROMPT_CHIPS = [
  { icon: '⚡', label: 'Technical Audit for my site' },
  { icon: '🎯', label: 'Low competition SaaS keywords' },
  { icon: '✍️', label: 'Generate 2,000w SEO Article' },
  { icon: '📊', label: 'Analyze GSC CTR Opportunities' },
]

export default function Hero() {
  const [activePrompt, setActivePrompt] = useState(PROMPT_CHIPS[0].label)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSelectPrompt = (prompt) => {
    setActivePrompt(prompt)
    setIsSimulating(true)
    setTimeout(() => setIsSimulating(false), 800)
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <Container className="flex flex-col items-center text-center">
        {/* Top Pill Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary backdrop-blur-md">
          <Sparkles size={14} className="animate-spin text-primary" style={{ animationDuration: '8s' }} />
          <span>Next-Gen AI SEO Assistant</span>
          <span className="h-1 w-1 rounded-full bg-primary" />
          <span className="text-primary font-bold">2.0 Active</span>
        </div>

        {/* Main Headline */}
        <h1 className="max-w-4xl font-heading text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Automate your SEO with an <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-primary-emerald via-primary to-accent-lime bg-clip-text text-transparent">
            AI-Powered Assistant
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base text-text-muted sm:text-xl leading-relaxed">
          Keyword research, technical audits, AI content generation, and Google Search Console insights — experience instant, intelligent recommendations in seconds.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <Button as={Link} to="/signup" variant="primary" size="lg">
            Start Free Trial
            <ArrowRight size={18} />
          </Button>
          <Button as="a" href="#services" variant="outline" size="lg">
            Explore All 9 Tools
          </Button>
        </div>

        {/* Interactive Prompt Selector */}
        <div className="mt-12 w-full max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Click to test AI Prompts:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PROMPT_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleSelectPrompt(chip.label)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                  activePrompt === chip.label
                    ? 'border-primary bg-primary/15 text-primary font-semibold shadow-sm'
                    : 'border-border bg-surface/60 text-text-muted hover:border-primary/40 hover:text-text'
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dribbble-inspired AI Chatbot Preview Card Mockup */}
        <div className="mt-10 w-full max-w-4xl rounded-3xl border border-border bg-surface-card/90 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl shadow-[var(--glow)] text-left">
          {/* Mockup Header */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-emerald to-primary text-[#061006] font-bold">
                <Bot size={22} />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface bg-primary" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-text flex items-center gap-2">
                  SEO Copilot AI
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">PRO</span>
                </h4>
                <p className="text-xs text-text-muted">Real-time site analysis & recommendation engine</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                Live Connection
              </span>
            </div>
          </div>

          {/* Chat Stream Area */}
          <div className="space-y-4 py-2">
            {/* User Message Bubble */}
            <div className="flex items-start justify-end gap-2.5">
              <div className="max-w-md rounded-2xl rounded-tr-none bg-surface-2 px-4 py-3 text-xs sm:text-sm text-text border border-border">
                <p className="font-medium">{activePrompt}</p>
              </div>
            </div>

            {/* AI Assistant Response Bubble */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary font-bold border border-primary/30">
                <Sparkles size={16} />
              </div>
              <div className="flex-1 space-y-3">
                <div className="rounded-2xl rounded-tl-none border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm text-text">
                  {isSimulating ? (
                    <div className="flex items-center gap-2 text-primary py-1 font-medium">
                      <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                      Analyzing query & generating SEO recommendation...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="font-semibold text-primary flex items-center gap-2">
                        <CheckCircle2 size={16} /> Analysis Completed in 0.42s
                      </p>
                      <p className="text-text-muted leading-relaxed">
                        I crawled the target parameters for <strong className="text-text">"{activePrompt}"</strong>. Here is your instant SEO optimization summary:
                      </p>

                      {/* Metric Pill Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                        <div className="rounded-xl border border-border bg-surface/80 p-2.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">On-Page Health</span>
                          <p className="text-base font-extrabold text-primary">94 / 100</p>
                        </div>
                        <div className="rounded-xl border border-border bg-surface/80 p-2.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Est. Volume</span>
                          <p className="text-base font-extrabold text-text">18,400/mo</p>
                        </div>
                        <div className="col-span-2 sm:col-span-1 rounded-xl border border-border bg-surface/80 p-2.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Keyword Diff.</span>
                          <p className="text-base font-extrabold text-accent-lime">28 (Low)</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chat Input Bar */}
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-surface-2 p-2">
            <input
              type="text"
              readOnly
              value={activePrompt}
              className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-text outline-none"
            />
            <Button as={Link} to="/signup" size="sm" variant="primary" className="!rounded-xl px-4">
              <span>Run Tool</span>
              <CornerDownLeft size={14} />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

