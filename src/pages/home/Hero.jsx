import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import Container from '../../components/common/Container'
import Button from '../../components/common/Button'
import ScrambleText from '../../components/common/ScrambleText'
import DashboardAssembly from '../../components/home/DashboardAssembly'
import ArcGlow from '../../components/common/ArcGlow'
import SkylineCurve from '../../components/common/SkylineCurve'
import { useAuth } from '../../context/AuthContext'

const POP_TRANSITION = { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }

// Rising bubbles scoped to the hero's own bounds — the same persistent
// "underwater" motif the site-wide PageBackground now carries everywhere
// else, which the hero never sees since it opts out of that background
// entirely for its own opaque aurora. Kept off dead-center so they never
// cross directly behind the headline.
const HERO_BUBBLES = [
  { left: '6%', size: 5, duration: 13, delay: 0 },
  { left: '16%', size: 3, duration: 17, delay: 3.5 },
  { left: '28%', size: 4, duration: 15, delay: 7 },
  { left: '72%', size: 4, duration: 16, delay: 1.5 },
  { left: '85%', size: 3, duration: 14, delay: 5 },
  { left: '94%', size: 5, duration: 18, delay: 9 },
]

/* ─── Stagger variants for Framer Motion ────────────────────────────────── */
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const popUp = {
  hidden:  { opacity: 0, y: 20, scale: 1.2 },
  visible: { opacity: 1, y: 0, scale: 1, transition: POP_TRANSITION },
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const [revealed, setRevealed] = useState(false)
  const { isAuthenticated } = useAuth()
  const reduceMotion = useReducedMotion()

  // Mouse-driven parallax/tilt — turns the flat stack of layers into a
  // scene with real depth: the arcs/horizon tilt in 3D toward the cursor
  // like a sheet of glass catching light, the dashboard mockup and glow
  // blobs drift by smaller, independent amounts, and even the headline
  // shifts a couple of px. Layers that move less read as farther away.
  // Springs everything so it settles smoothly rather than tracking the
  // cursor 1:1. Entirely skipped for reduced-motion users (motion values
  // just stay at 0, so every transform below resolves to a no-op).
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 55, damping: 22, mass: 0.7 })
  const springY = useSpring(pointerY, { stiffness: 55, damping: 22, mass: 0.7 })

  useEffect(() => {
    if (reduceMotion) return undefined
    const handleMove = (e) => {
      pointerX.set(e.clientX / window.innerWidth - 0.5)
      pointerY.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [reduceMotion, pointerX, pointerY])

  const arcRotateY = useTransform(springX, [-0.5, 0.5], [9, -9])
  const arcRotateX = useTransform(springY, [-0.5, 0.5], [-6, 6])
  const arcX = useTransform(springX, [-0.5, 0.5], [-10, 10])

  const dashX = useTransform(springX, [-0.5, 0.5], [-18, 18])
  const dashY = useTransform(springY, [-0.5, 0.5], [-12, 12])

  const blobAX = useTransform(springX, [-0.5, 0.5], [-14, 14])
  const blobAY = useTransform(springY, [-0.5, 0.5], [-10, 10])
  const blobBX = useTransform(springX, [-0.5, 0.5], [10, -10])
  const blobBY = useTransform(springY, [-0.5, 0.5], [8, -8])

  const textX = useTransform(springX, [-0.5, 0.5], [4, -4])
  const textY = useTransform(springY, [-0.5, 0.5], [3, -3])

  return (
    <section
      id="home"
      // Full-screen hero on its own — the strip right after it is meant to
      // sit below the fold now, not squeezed into the same screen as the
      // hero (an earlier pass shrank this specifically to fit both, which
      // traded away the hero being shown at full size on its own).
      className="relative isolate overflow-hidden"
      style={{ minHeight: '100dvh' }}
    >
      {/* The hero gets its own clean stage instead of showing the site-wide
          PageBackground's diagonal corner ribbons through here — a softly
          drifting aurora fill (same violet tokens, still fully opaque via
          its own --color-bg base layer) stands in for a flat color, giving
          the whole banner a slow, ambient "moving light" quality rather
          than a static wash. Sped up from the site's default 22s cycle so
          the movement actually reads in the time someone looks at a hero. */}
      <div className="absolute inset-0 -z-20 hero-aurora-bg" style={{ animationDuration: '13s' }} />

      {/* A soft dark vignette at the edges — pulls focus toward the centered
          headline and gives the whole banner more cinematic depth instead
          of one flat wash of color edge-to-edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 45%, transparent 45%, rgba(30,14,64,0.22) 100%)' }}
      />

      {/* Bubbles rising through the hero — same motif the rest of the site
          now carries via PageBackground, which the hero doesn't see since
          it renders its own opaque backdrop instead. */}
      {!reduceMotion && HERO_BUBBLES.map((b, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute -z-20 rounded-full bg-blue-200 animate-bubble-rise"
          style={{
            left: b.left,
            bottom: '-5%',
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}

      {/* Two soft, independently-drifting glow blobs layered on top of the
          aurora (same -z-20 layer — DOM order alone puts them above it) —
          reuses the site's existing float/pulse-glow utilities rather than
          inventing new keyframes, kept off to the sides so they never sit
          behind the centered headline text. Each also gets its own small
          parallax drift, in opposite directions, for extra depth. */}
      <motion.div
        aria-hidden="true"
        style={{ x: blobAX, y: blobAY }}
        className="absolute left-[10%] top-[18%] -z-20 h-72 w-72 rounded-full blur-[90px] animate-float-slow animate-pulse-glow"
      >
        <div className="h-full w-full rounded-full" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)' }} />
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ x: blobBX, y: blobBY }}
        className="absolute right-[8%] top-[8%] -z-20 h-64 w-64 rounded-full blur-[90px] animate-float animate-pulse-glow"
      >
        <div className="h-full w-full rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)' }} />
      </motion.div>

      {/* The reference's wide horizon curve + concentric arcs, tilted in 3D
          toward the cursor like a pane of glass — the main "this scene has
          depth" cue. */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ perspective: 1100 }}
      >
        <motion.div
          className="h-full w-full"
          style={{ rotateX: arcRotateX, rotateY: arcRotateY, x: arcX, transformStyle: 'preserve-3d' }}
        >
          <SkylineCurve />
          <ArcGlow variant="hero" />
        </motion.div>
      </motion.div>

      {/* Dashboard mockup gets its own, smaller parallax shift (translate
          only — no rotation, since its internal cards rely on Framer
          Motion's shared-layout animation and shouldn't be perturbed). */}
      <motion.div className="absolute inset-0 -z-10" style={{ x: dashX, y: dashY }}>
        <DashboardAssembly className="absolute inset-0" onFirstComplete={() => setRevealed(true)} />
      </motion.div>

      {/* Small tagline sitting in the gap between the navbar and the curve's
          peak — that stretch of the hero was empty before. Sized to clear
          the curve's own bloom rather than fight it for attention. */}
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="absolute inset-x-0 top-6 z-10 px-4 text-center text-sm font-medium tracking-[0.15em] text-text-secondary sm:top-8 sm:text-base"
      >
        <span className="text-primary">Own the Search.</span> Own the Market.
      </motion.p>

      <Container
        className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center text-center"
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={revealed ? 'visible' : 'hidden'}
          style={{ x: textX, y: textY }}
          className="flex flex-col items-center"
        >
          {/* Headline */}
          <motion.h1
            variants={popUp}
            className="font-heading text-4xl font-normal leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            AI Intelligence
            <br />
            Behind Better Rankings
          </motion.h1>

          {/* CTA Buttons */}
          <motion.div variants={popUp} className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              as={Link}
              to={isAuthenticated ? '/app' : '/login'}
              variant="primary"
              size="lg"
              className="glow-md hover:glow-lg"
            >
              <ScrambleText text="Start Free" />
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button as="a" href="#services" variant="outline" size="lg">
              <ScrambleText text="Explore Tools" />
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
