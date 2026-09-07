import RevealBox from '../../components/common/RevealBox'
import Container from '../../components/common/Container'
import WaveDivider from '../../components/common/WaveDivider'
import ComparisonChart from '../../components/home/ComparisonChart'
import TerminalCard from '../../components/home/TerminalCard'

// Drifting motes continuing the deep-sea current from the sections above —
// same ambient language as the strip/About, purely decorative.
const MOTES = [
  { left: '4%', top: '20%', size: 5, delay: 0 },
  { left: '10%', top: '70%', size: 4, delay: 1.6 },
  { left: '93%', top: '18%', size: 5, delay: 0.8 },
  { left: '96%', top: '62%', size: 4, delay: 2.3 },
]

/* ═══════════════════════════════════════════════════════════════════════════
   PERFORMANCE & CLI — the comparison chart + terminal card, in their own
   file (matching the Hero/About/Services pattern) so the deep-sea backdrop
   treatment has somewhere to live without cluttering Home.jsx. The two
   cards themselves (ComparisonChart, TerminalCard) are untouched — every
   addition here is a background/decoration layer sitting behind them.
═══════════════════════════════════════════════════════════════════════════ */
export default function PerformanceCli() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-surface/40">
      {/* Wave lead-in continuing the current from About above */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-1">
        <WaveDivider gradientId="wave-perf" />
      </div>

      {/* Underwater wash — same blue-violet band used on the strip/About */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(30,64,175,0.05) 0%, rgba(76,29,149,0.07) 50%, rgba(30,64,175,0.05) 100%)',
        }}
      />

      {/* Two soft glow blobs drifting behind the cards — same technique as
          the hero's ambient blobs, giving the pair of cards a backlit,
          premium feel rather than sitting flat on the background. */}
      <div
        className="pointer-events-none absolute left-[8%] top-1/3 -z-10 h-72 w-72 rounded-full blur-[100px] animate-float-slow animate-pulse-glow"
        style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.28) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute right-[8%] bottom-0 -z-10 h-72 w-72 rounded-full blur-[100px] animate-float animate-pulse-glow"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 70%)' }}
      />

      {/* Rising motes */}
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-blue-200 animate-float-slow animate-pulse-glow"
          style={{ left: m.left, top: m.top, width: m.size, height: m.size, animationDelay: `${m.delay}s` }}
        />
      ))}

      <Container className="relative">
        <RevealBox direction="fade-up" className="mb-10 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-normal tracking-wider text-primary uppercase backdrop-blur-md">
            Performance & CLI
          </span>
          <h2 className="mt-3 font-heading text-3xl font-normal tracking-tight text-text sm:text-4xl">
            Built for speed, built for SEOs
          </h2>
          <p className="mt-4 text-base text-text-muted sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Benchmark results speak for themselves — and the CLI keeps you in control.
          </p>
        </RevealBox>

        <div className="grid gap-8 lg:grid-cols-2">
          <RevealBox direction="fade-left" delay={0.1}>
            <ComparisonChart className="h-full" />
          </RevealBox>
          <RevealBox direction="fade-right" delay={0.18}>
            <TerminalCard className="h-full" />
          </RevealBox>
        </div>
      </Container>
    </section>
  )
}
