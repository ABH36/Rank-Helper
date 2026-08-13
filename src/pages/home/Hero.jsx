import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Container from '../../components/common/Container'
import Button from '../../components/common/Button'
import ScrambleText from '../../components/common/ScrambleText'
import DashboardAssembly from '../../components/home/DashboardAssembly'

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

// DashboardAssembly's own background is always a light blue/white → vivid purple-pink
// gradient (matched to the reference video), regardless of site theme — so once the
// headline/CTAs reveal on top of it, they need fixed dark-on-light colors rather than
// this site's normal theme-token text color, which would go light-on-light in dark mode.
const OVERLAY_TOKENS = {
  '--text': '#1e2a5e',
  '--text-secondary': '#3d4a7a',
  '--text-muted': '#6b7398',
  '--border': 'rgba(30,42,94,0.15)',
  '--surface': 'rgba(255,255,255,0.55)',
  '--surface-2': 'rgba(255,255,255,0.35)',
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const [revealed, setRevealed] = useState(false)

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
        style={OVERLAY_TOKENS}
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
            style={{ color: '#0a0a0a' }}
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
