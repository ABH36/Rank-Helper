import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Bell, Gauge, LineChart, Search, Sparkles, Table2, TrendingUp } from 'lucide-react'

const LOGO_MS = 1300
const PROMPT_MS = 3400 // how long the headline+button prompt shows before auto-advancing
const BUILD_MS = 1400 // how long cards stay "loose" before snapping into the grid
const SETTLE_MS = 1100 // how long the fully-assembled dashboard holds crisp before receding

const EASE = [0.22, 1, 0.36, 1]

// Colors matched directly to the reference video (not this site's own purple/black
// brand tokens) — a soft blue-lavender intro (never fading to flat white) that deepens
// into a vivid blue → purple → pink gradient once the dashboard assembles, with light
// glassy cards + dark navy text.
const BG_LIGHT = 'linear-gradient(180deg, #d3e0fb 0%, #dde2f7 50%, #e7e2f4 100%)'
const BG_VIVID = 'linear-gradient(135deg, #5865d6 0%, #8b5cd6 45%, #d669c4 100%)'
const ACCENT_GRADIENT = 'linear-gradient(90deg, #5865d6, #a35cd6, #d669c4)'
// Same soft lavender as BG_LIGHT, but translucent — matches the reference video's
// glassy, see-through cards instead of solid opaque white panels.
const CARD_BG = 'rgba(221, 226, 247, 0.38)'
const HEADER_BG = 'rgba(221, 226, 247, 0.3)'
const TEXT_DARK = '#0a0a0a'
const TEXT_MUTED = '#6b7398'
// Same gradient PageLoader.jsx uses for the site's real reload-screen brand mark —
// reused here so the hero's logo moment is identical to the rest of the site, not
// a separate invented style.
const LOGO_GRADIENT = 'linear-gradient(to top right, var(--color-primary-emerald), var(--color-primary))'

const POP_TRANSITION = { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }

// One-shot: peaks to solid white right as the logo zooms in and disappears, then
// fades back out — a "zoom through to white" transition into the next scene.
function WhiteFlash() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 1, 0] }}
      transition={{ duration: 2.1, times: [0, 0.6, 0.72, 1], ease: 'easeInOut' }}
    />
  )
}

function LogoScene() {
  return (
    <motion.div
      key="logo"
      className="absolute inset-0 flex flex-col items-center justify-center gap-3"
      initial={{ opacity: 0, scale: 1.35 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 2.6, transition: { duration: 0.55, ease: [0.55, 0, 1, 0.45] } }}
      transition={POP_TRANSITION}
    >
      <span
        className="flex h-16 w-16 items-center justify-center rounded-2xl text-[#061006] shadow-lg"
        style={{ background: LOGO_GRADIENT }}
      >
        <Sparkles size={30} className="animate-pulse" />
      </span>
      <span className="font-heading text-xl font-normal" style={{ color: TEXT_DARK }}>
        RankHelper
      </span>
    </motion.div>
  )
}

// Reveals text one character at a time, like it's being typed.
function TypewriterText({ text, color, delay = 0, step = 0.035 }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.01, delay: delay + i * step }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </>
  )
}

const LINE_1 = 'Rank Your Website'
const LINE_2 = "on Google's First Page"
const TYPE_STEP = 0.035
const LINE_2_DELAY = LINE_1.length * TYPE_STEP + 0.15
const BUTTON_DELAY = LINE_2_DELAY + LINE_2.length * TYPE_STEP + 0.3

function PromptScene({ onStart }) {
  return (
    <motion.div
      key="prompt"
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
      initial={{ opacity: 0, scale: 1.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.35 } }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      <p className="font-heading text-3xl font-normal leading-tight sm:text-4xl md:text-5xl">
        <TypewriterText text={LINE_1} color={TEXT_DARK} />
        <br />
        <TypewriterText text={LINE_2} color={TEXT_DARK} delay={LINE_2_DELAY} />
      </p>
      <motion.button
        type="button"
        onClick={onStart}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: BUTTON_DELAY }}
        className="inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-lg font-normal text-white shadow-xl transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        style={{ background: ACCENT_GRADIENT }}
      >
        Get Started
        <ArrowRight size={20} />
      </motion.button>
    </motion.div>
  )
}

/* One dashboard card. Renders in either "loose" (scattered, off to a corner) or
   "docked" (inside the assembled grid) layout — same layoutId in both, so Framer
   Motion automatically animates the position/size change between them. */
function DashCard({ id, loose, className = '', children }) {
  return (
    <motion.div
      layoutId={id}
      layout
      className={`rounded-xl p-3 shadow-lg backdrop-blur-sm ${className}`}
      style={{ background: CARD_BG, ...(loose ? { position: 'absolute', ...loose.pos } : {}) }}
      initial={loose ? { opacity: 0, ...loose.from } : { opacity: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function CardLabel({ icon: Icon, label }) {
  return (
    <p className="mb-1.5 flex items-center gap-1.5 text-[9px] font-normal uppercase tracking-widest" style={{ color: TEXT_MUTED }}>
      <Icon size={10} style={{ color: '#8b5cd6' }} />
      {label}
    </p>
  )
}

function LooseLayout() {
  return (
    <div className="absolute inset-0 p-4">
      <DashCard
        id="search"
        loose={{ pos: { top: '38%', left: '50%', width: '78%', transform: 'translateX(-50%)' }, from: { y: -30, scale: 0.9 } }}
        className="flex items-center gap-2 !rounded-full px-4 py-2.5"
      >
        <Search size={14} style={{ color: TEXT_MUTED }} />
        <span className="flex-1 text-left text-xs" style={{ color: TEXT_MUTED }}>Analyze your site...</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ background: ACCENT_GRADIENT }}>
          <ArrowRight size={12} />
        </span>
      </DashCard>

      <DashCard id="traffic" loose={{ pos: { top: '6%', left: '4%', width: '42%' }, from: { x: -50, y: -30 } }}>
        <CardLabel icon={TrendingUp} label="Traffic Growth" />
        <p className="font-heading text-sm font-normal" style={{ color: TEXT_DARK }}>+68%</p>
      </DashCard>

      <DashCard id="keyword" loose={{ pos: { top: '4%', right: '4%', width: '34%' }, from: { x: 50, y: -30 } }}>
        <CardLabel icon={LineChart} label="Keyword Volume" />
        <p className="font-heading text-sm font-normal" style={{ color: TEXT_DARK }}>8,100</p>
      </DashCard>

      <DashCard id="score" loose={{ pos: { bottom: '5%', left: '5%', width: '36%' }, from: { x: -50, y: 30 } }}>
        <CardLabel icon={Gauge} label="SEO Score" />
        <p className="font-heading text-sm font-normal" style={{ color: TEXT_DARK }}>92%</p>
      </DashCard>

      <DashCard id="pages" loose={{ pos: { bottom: '4%', right: '4%', width: '40%' }, from: { x: 50, y: 30 } }}>
        <CardLabel icon={Table2} label="Top Pages" />
        <p className="font-heading text-sm font-normal" style={{ color: TEXT_DARK }}>/blog/seo-guide</p>
      </DashCard>
    </div>
  )
}

function AssembledLayout() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: HEADER_BG, borderBottom: '1px solid rgba(30,42,94,0.08)' }}>
        <span className="font-heading text-xs font-normal" style={{ color: TEXT_DARK }}>SEO Dashboard</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: CARD_BG, color: TEXT_MUTED }}>
            <Search size={11} />
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: CARD_BG, color: TEXT_MUTED }}>
            <Bell size={11} />
          </span>
        </div>
      </div>

      {/* Grid body */}
      <div className="grid flex-1 grid-cols-2 gap-2 p-3 sm:grid-cols-4">
        <DashCard id="search" className="col-span-2 flex items-center gap-2 !rounded-full px-4 py-2 sm:col-span-4">
          <Search size={13} style={{ color: TEXT_MUTED }} />
          <span className="flex-1 text-left text-xs" style={{ color: TEXT_MUTED }}>Analyze your site...</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ background: ACCENT_GRADIENT }}>
            <ArrowRight size={12} />
          </span>
        </DashCard>

        <DashCard id="traffic" className="col-span-2 row-span-2 sm:col-span-2">
          <CardLabel icon={TrendingUp} label="Traffic Growth" />
          <p className="font-heading text-lg font-normal" style={{ color: TEXT_DARK }}>+68%</p>
          <p className="text-[9px]" style={{ color: TEXT_MUTED }}>vs. last 30 days</p>
        </DashCard>

        <DashCard id="keyword" className="col-span-1 sm:col-span-2">
          <CardLabel icon={LineChart} label="Keyword Volume" />
          <p className="font-heading text-sm font-normal" style={{ color: TEXT_DARK }}>8,100 / mo</p>
        </DashCard>

        <DashCard id="score" className="col-span-1 sm:col-span-2">
          <CardLabel icon={Gauge} label="SEO Score" />
          <p className="font-heading text-lg font-normal" style={{ color: TEXT_DARK }}>92%</p>
        </DashCard>

        <DashCard id="pages" className="col-span-2">
          <CardLabel icon={Table2} label="Top Pages" />
          <div className="flex items-center justify-between text-[10px]" style={{ color: TEXT_MUTED }}>
            <span style={{ color: TEXT_DARK }}>/blog/seo-guide</span>
            <span style={{ color: TEXT_DARK, fontWeight: 600 }}>1.2K clicks</span>
          </div>
        </DashCard>
      </div>
    </motion.div>
  )
}

export default function DashboardAssembly({ className = '', onFirstComplete }) {
  const [phase, setPhase] = useState('logo') // 'logo' | 'prompt' | 'assembling' | 'assembled' | 'settled'
  const reduceMotion = useReducedMotion()
  const timers = useRef([])
  const firedComplete = useRef(false)

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    if (reduceMotion) {
      setPhase('settled')
      onFirstComplete?.()
      return undefined
    }
    timers.current.push(setTimeout(() => setPhase('prompt'), LOGO_MS))
    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion])

  useEffect(() => {
    if (phase !== 'prompt') return undefined
    // Auto-advances even if nobody clicks — the button stays clickable for an
    // early trigger, but the sequence must always play through on its own so
    // it never gets stuck waiting on a hero-banner visitor who won't click a
    // decorative element.
    const t = setTimeout(() => setPhase('assembling'), PROMPT_MS)
    timers.current.push(t)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'assembling') return undefined
    const t = setTimeout(() => setPhase('assembled'), BUILD_MS)
    timers.current.push(t)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    // Hold the fully-assembled dashboard crisp for a beat, then recede it into
    // a dim backdrop as 'settled' — the real hero headline fades in at exactly
    // that moment, so the busy card grid never sits at full strength directly
    // behind the big headline text (that's what caused the cluttered overlap).
    if (phase !== 'assembled') return undefined
    const t = setTimeout(() => setPhase('settled'), SETTLE_MS)
    timers.current.push(t)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    // Once settled, the sequence stops here for good — no reset back to the
    // prompt/logo. The real hero headline stays as the permanent resting state
    // instead of the animation looping forever.
    if (phase !== 'settled' || firedComplete.current) return undefined
    firedComplete.current = true
    onFirstComplete?.()
    return undefined
  }, [phase, onFirstComplete])

  const handleStart = () => setPhase('assembling')
  const isVivid = phase === 'assembling' || phase === 'assembled' || phase === 'settled'
  const isDashboardVisible = phase === 'assembled' || phase === 'settled'

  return (
    <div className={`h-full w-full overflow-hidden select-none ${className}`}>
      {/* Background — crossfades from the light intro gradient to the vivid assembled gradient */}
      <motion.div
        className="absolute inset-0"
        style={{ background: BG_LIGHT }}
        animate={{ opacity: isVivid ? 0 : 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: BG_VIVID }}
        animate={{ opacity: isVivid ? 1 : 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      />

      {/* Flashes the *entire* background white during the logo's zoom-through exit —
          must live at this level (not inside the fixed-size stage below), otherwise
          it only lights up that smaller centered box and looks like a floating card */}
      {!reduceMotion && <WhiteFlash />}

      {/* Content stage — kept to a contained size so cards/dashboard don't stretch
          across the full viewport height now that this component is a full-bleed
          section background rather than a small card. Offset top-24 to match the
          -top-24 the caller (Hero.jsx) adds to this component's own root: the root
          box is now 96px taller (extended upward, behind the navbar) so centering
          content across its FULL height would drag the logo/text/cards up with it.
          This inset keeps the stage's own bounds pinned to where the root box used
          to start, so only the background layers behind it extend upward. */}
      <div className="absolute inset-x-0 bottom-0 top-24 flex items-center justify-center p-6">
        <div className="relative h-[420px] w-full max-w-2xl sm:h-[480px]">
          <AnimatePresence mode="wait">
            {phase === 'logo' && <LogoScene />}
            {phase === 'prompt' && <PromptScene onStart={handleStart} />}
          </AnimatePresence>

          {phase === 'assembling' && <LooseLayout />}
          {isDashboardVisible && (
            <motion.div
              className="absolute inset-0"
              animate={{
                opacity: phase === 'settled' ? 0.22 : 1,
                filter: phase === 'settled' ? 'blur(4px)' : 'blur(0px)',
              }}
              transition={{ duration: 1, ease: EASE }}
            >
              <AssembledLayout />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
