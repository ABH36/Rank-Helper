import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Container from '../../components/common/Container'
import Button from '../../components/common/Button'
import ScrambleText from '../../components/common/ScrambleText'
import DashboardAssembly from '../../components/home/DashboardAssembly'
import { useTheme } from '../../context/ThemeContext'

const POP_TRANSITION = { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }

/* ─── Stagger variants for Framer Motion ────────────────────────────────── */
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const popUp = {
  hidden:  { opacity: 0, y: 20, scale: 1.2 },
  visible: { opacity: 1, y: 0, scale: 1, transition: POP_TRANSITION },
}

// DashboardAssembly's own background is a light blue/white → vivid purple-pink
// gradient in light mode, but a near-black ribbon background in dark mode — so
// the headline/CTAs on top need their own fixed colors (not this site's normal
// theme-token text color) matched to whichever of those two is showing.
const OVERLAY_TOKENS_LIGHT = {
  '--text': '#3a1f42',
  '--text-secondary': '#5c3a63',
  '--text-muted': '#7a5f82',
  '--border': 'rgba(58,31,66,0.15)',
  '--surface': 'rgba(255,255,255,0.55)',
  '--surface-2': 'rgba(255,255,255,0.35)',
}
const OVERLAY_TOKENS_DARK = {
  '--text': '#f5f3ff',
  '--text-secondary': '#d8cbe8',
  '--text-muted': '#c9b8dc',
  '--border': 'rgba(245,243,255,0.15)',
  '--surface': 'rgba(255,255,255,0.08)',
  '--surface-2': 'rgba(255,255,255,0.05)',
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const [revealed, setRevealed] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const overlayTokens = isDark ? OVERLAY_TOKENS_DARK : OVERLAY_TOKENS_LIGHT
  const headlineColor = isDark ? '#f5f3ff' : '#0a0a0a'

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden"
      style={{ minHeight: '100dvh' }}
    >
      {/* Dashboard-assembly plays first, full-bleed, as the hero's own background —
          extended above the section's own top edge (-top-24) so it reaches all the
          way behind the sticky navbar's reserved space, closing the gap that would
          otherwise show the site's normal dark background peeking through above it.
          Only the background extends up; the headline/CTA content below is untouched
          and stays exactly where it was. */}
      <DashboardAssembly className="absolute -top-24 inset-x-0 bottom-0 -z-10" onFirstComplete={() => setRevealed(true)} />

      <Container
        className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center text-center"
        style={overlayTokens}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={revealed ? 'visible' : 'hidden'}
          className="flex flex-col items-center"
        >
          {/* Headline */}
          <motion.h1
            variants={popUp}
            className="font-heading text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            style={{ color: headlineColor }}
          >
            AI Intelligence
            <br />
            Behind Better Rankings
          </motion.h1>

          {/* CTA Buttons */}
          <motion.div variants={popUp} className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              as={Link}
              to="/signup"
              variant="primary"
              size="lg"
              className="glow-md hover:glow-lg"
            >
              <ScrambleText text="Start Free — No Card" />
              <ArrowRight size={18} />
            </Button>
            <Button as="a" href="#services" variant="outline" size="lg">
              <ScrambleText text="Explore 9 Tools" />
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
