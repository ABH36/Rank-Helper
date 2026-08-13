import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Bell, Gauge, LineChart, Search, Sparkles, Table2, TrendingUp } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const LOGO_MS = 1300
const PROMPT_MS = 3400 // how long the headline+button prompt shows before auto-advancing
const BUILD_MS = 1400 // how long cards stay "loose" before snapping into the grid
const SETTLE_MS = 1100 // how long the fully-assembled dashboard holds crisp before receding

const EASE = [0.22, 1, 0.36, 1]

// Both themes share the same glowing-ribbon background design — only the base
// field color and whether the star dots show differ. Light mode: a flat pale
// lavender field. Dark mode: near-black.
const LIGHT_RIBBON_BG = 'linear-gradient(to right, #eae5fb 0%, #eae5fb 100%)'
const DARK_RIBBON_BG = 'radial-gradient(ellipse 90% 70% at 25% 15%, #1c0f24 0%, #0a0710 55%, #050308 100%)'
const ACCENT_GRADIENT = 'linear-gradient(90deg, #7c3aed, #d946ef, #f472b6)'
// These read as CSS custom properties (set inline on the root, per theme) rather
// than fixed hex values, so every card/text usage below flips automatically
// between the light lavender look and the dark ribbon look — no prop drilling.
const CARD_BG = 'var(--dash-card-bg)'
const HEADER_BG = 'var(--dash-header-bg)'
const TEXT_DARK = 'var(--dash-text)'
const TEXT_MUTED = 'var(--dash-text-muted)'
// Same gradient PageLoader.jsx uses for the site's real reload-screen brand mark —
// reused here so the hero's logo moment is identical to the rest of the site, not
// a separate invented style.
const LOGO_GRADIENT = 'linear-gradient(to top right, var(--color-primary-emerald), var(--color-primary))'

const POP_TRANSITION = { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }

// A faint scatter of star-like dots — only shown over the dark field, since
// they'd be invisible against the light lavender field.
const STAR_DOTS = [
  ['8%', '12%', 3, 0.6], ['15%', '30%', 2, 0.4], ['22%', '8%', 2, 0.5],
  ['30%', '46%', 3, 0.35], ['12%', '62%', 2, 0.45], ['38%', '22%', 2, 0.3],
  ['5%', '78%', 3, 0.5], ['45%', '65%', 2, 0.35], ['18%', '88%', 2, 0.4],
]

// Shared background for both themes — glowing magenta ribbons arcing up from
// the bottom-right corner over a subtle film-grain texture, matching the
// reference the user provided. Only the base field (dark vs. light lavender)
// and the star dots differ between themes.
function RibbonBackground({ baseBackground, showStars }) {
  const ribbon = (width, height, rotate, translate, colors, glow) => ({
    className: 'absolute rounded-full',
    style: {
      width,
      height,
      background: `linear-gradient(90deg, ${colors})`,
      transform: `rotate(${rotate}deg) translate(${translate})`,
      filter: `drop-shadow(0 0 30px ${glow})`,
    },
  })

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ background: baseBackground }}
    >
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {showStars && STAR_DOTS.map(([top, left, size, opacity], i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ top, left, width: size, height: size, opacity }}
        />
      ))}
      <div
        className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.45) 0%, transparent 70%)' }}
      />
      <div className="absolute -bottom-24 -right-24 h-[420px] w-[620px]">
        <div {...ribbon('560px', '96px', -30, '20px, 60px', '#6b21a8, #c026d3, #f0abfc', 'rgba(217,70,239,0.4)')} />
        <div {...ribbon('520px', '80px', -18, '60px, 130px', '#86198f, #d946ef, #f5d0fe', 'rgba(217,70,239,0.35)')} />
        <div {...ribbon('480px', '64px', -6, '110px, 210px', '#581c87, #a21caf, #e879f9', 'rgba(217,70,239,0.3)')} />
      </div>
    </div>
  )
}

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
      <Icon size={10} style={{ color: '#c93fa8' }} />
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

// Light mode: dark navy-on-lavender text + translucent lavender glass cards
// (matches the reference video). Dark mode: light text + translucent white
// glass cards, readable over the near-black ribbon background instead.
const DASH_VARS_LIGHT = {
  '--dash-text': '#0a0a0a',
  '--dash-text-muted': '#6b5b7a',
  '--dash-card-bg': 'rgba(255, 255, 255, 0.5)',
  '--dash-header-bg': 'rgba(255, 255, 255, 0.35)',
}
const DASH_VARS_DARK = {
  '--dash-text': '#f5f3ff',
  '--dash-text-muted': '#c9b8dc',
  '--dash-card-bg': 'rgba(255, 255, 255, 0.07)',
  '--dash-header-bg': 'rgba(255, 255, 255, 0.05)',
}

export default function DashboardAssembly({ className = '', onFirstComplete }) {
  const [phase, setPhase] = useState('logo') // 'logo' | 'prompt' | 'assembling' | 'assembled' | 'settled'
  const reduceMotion = useReducedMotion()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
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
  const isDashboardVisible = phase === 'assembled' || phase === 'settled'

  return (
    <div
      className={`h-full w-full overflow-hidden select-none ${className}`}
      style={isDark ? DASH_VARS_DARK : DASH_VARS_LIGHT}
    >
      <RibbonBackground baseBackground={isDark ? DARK_RIBBON_BG : LIGHT_RIBBON_BG} showStars={isDark} />

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
