import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Container from '../../components/common/Container'
import Button from '../../components/common/Button'
import ScrambleText from '../../components/common/ScrambleText'
import DashboardAssembly from '../../components/home/DashboardAssembly'

/* ─── Stagger variants for Framer Motion ────────────────────────────────── */
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  return (
    <section
      id="home"
      className="hero-aurora-bg relative isolate overflow-hidden"
      style={{ paddingTop: '5.5rem', paddingBottom: '5rem', minHeight: '100dvh' }}
    >
      <Container className="relative z-10">
        {/* ════════════ Text content ════════════ */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-heading text-4xl font-normal leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            AI Intelligence
            <br className="hidden sm:block" />
            {' '}Behind Better Rankings
          </motion.h1>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap justify-center gap-3">
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

        {/* ════════════ Full-width dashboard assembly ════════════ */}
        <motion.div
          className="relative mx-auto mt-12 w-full max-w-5xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <DashboardAssembly />
        </motion.div>
      </Container>
    </section>
  )
}
