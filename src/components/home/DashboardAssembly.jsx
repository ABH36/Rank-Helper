import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Gauge, LayoutGrid, LineChart,
  Link2, PieChart, Search, Settings, Sparkles, Table2, TrendingUp, User, Zap,
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const LOGO_MS = 1300
const PROMPT_MS = 3400 // how long the headline+button prompt shows before auto-advancing
const BUILD_MS = 1750 // how long cards stay "loose" before snapping into the grid
const SETTLE_MS = 1100 // how long the fully-assembled dashboard holds crisp before receding

const EASE = [0.22, 1, 0.36, 1]

const ACCENT_GRADIENT = 'linear-gradient(90deg, #7c3aed, #d946ef, #f472b6)'
// These read as CSS custom properties (set inline on the root, per theme) rather
// than fixed hex values, so every card/text usage below flips automatically
// between the light lavender look and the dark ribbon look — no prop drilling.
const CARD_BG = 'var(--dash-card-bg)'
const HEADER_BG = 'var(--dash-header-bg)'
const TEXT_DARK = 'var(--dash-text)'
const TEXT_MUTED = 'var(--dash-text-muted)'
const DONUT_HOLE = 'var(--dash-donut-hole)'
const DONUT_TRACK = 'var(--dash-donut-track)'

// A rough upward zigzag, hand-drawn (no charting library) for the traffic area chart.
const CHART_PATH = 'M2,34 C14,30 18,38 28,26 C38,16 44,24 54,14 C64,6 72,16 82,8 C92,2 100,10 110,4'

const PAGE_ROWS = [
  { page: '/blog/seo-guide', clicks: '1.2K', ctr: '6.4%', status: 'Growing', trend: 'up' },
  { page: '/tools/audit', clicks: '840', ctr: '4.1%', status: 'Stable', trend: 'up' },
  { page: '/pricing', clicks: '512', ctr: '2.8%', status: 'Watch', trend: 'down' },
]
const STATUS_STYLES = {
  Growing: { bg: 'rgba(34,197,94,0.18)', text: '#22c55e' },
  Stable: { bg: 'rgba(234,179,8,0.18)', text: '#ca8a04' },
  Watch: { bg: 'rgba(239,68,68,0.18)', text: '#ef4444' },
}
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
      className={`rounded-xl border border-white/10 p-2.5 shadow-lg backdrop-blur-sm ${className}`}
      style={{ background: CARD_BG, ...(loose ? { position: 'absolute', ...loose.pos } : {}) }}
      initial={loose ? { opacity: 0, ...loose.from } : { opacity: 0 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: loose?.delay ?? 0, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function CardLabel({ icon: Icon, label }) {
  return (
    <p className="mb-1 flex items-center gap-1.5 text-[9px] font-normal uppercase tracking-widest" style={{ color: TEXT_MUTED }}>
      <Icon size={10} style={{ color: '#c93fa8' }} />
      {label}
    </p>
  )
}

// Ring chart drawn with a conic-gradient (no charting library) — a colored
// sweep for `percent`, a hole punched out with a solid theme color so it
// reads as a ring, and the percentage centered inside like the reference.
function Donut({ percent, color, size = 52 }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: `conic-gradient(${color} ${percent * 3.6}deg, ${DONUT_TRACK} 0deg)` }}
      />
      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{ inset: size * 0.2, background: DONUT_HOLE }}
      >
        <span className="text-xs font-normal" style={{ color: TEXT_DARK }}>{percent}%</span>
      </div>
    </div>
  )
}

function MiniBars({ values, color }) {
  const max = Math.max(...values)
  return (
    <div className="flex h-9 items-end gap-1.5">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-2 rounded-full"
          style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.5 + (v / max) * 0.5 }}
        />
      ))}
    </div>
  )
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status]
  return (
    <span className="rounded-full px-2 py-0.5 text-[9px] font-normal" style={{ background: s.bg, color: s.text }}>
      {status}
    </span>
  )
}

// Narrow icon rail down the left edge — decorative, mirrors the reference's
// app-shell sidebar. Only appears once assembled (no loose counterpart).
function Sidebar() {
  return (
    <div
      className="hidden w-11 shrink-0 flex-col items-center gap-3 py-3 sm:flex"
      style={{ background: HEADER_BG, borderRight: '1px solid rgba(150,120,170,0.12)' }}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ background: ACCENT_GRADIENT }}>
        <Sparkles size={13} />
      </span>
      {[LayoutGrid, TrendingUp, PieChart, Settings].map((Icon, i) => (
        <span key={i} className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ color: TEXT_MUTED }}>
          <Icon size={14} />
        </span>
      ))}
      <span className="mt-auto h-6 w-6 rounded-full" style={{ background: ACCENT_GRADIENT }} />
    </div>
  )
}

// Cards fan out around the search bar (which sits left-of-center, the hub of
// the cluster) while still reaching every edge of the frame — a pure radius
// around a left-anchored point left the whole right half empty, so this uses
// explicit positions that surround the hub *and* fill the full width.
function LooseLayout() {
  return (
    <div className="absolute inset-0 p-3">
      <DashCard id="traffic" loose={{ pos: { top: '4%', left: '3%', width: '26%' }, from: { x: -14, y: -12, scale: 0.95 }, delay: 0 }}>
        <CardLabel icon={TrendingUp} label="Traffic Growth" />
        <p className="font-heading text-sm font-normal" style={{ color: TEXT_DARK }}>+68%</p>
        <svg viewBox="0 0 112 48" preserveAspectRatio="none" className="mt-1.5 h-8 w-full">
          <path d={CHART_PATH} fill="none" stroke="#d946ef" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </DashCard>

      <DashCard id="keyword" loose={{ pos: { top: '3%', left: '32%', width: '22%' }, from: { x: 4, y: -14, scale: 0.95 }, delay: 0.05 }}>
        <CardLabel icon={LineChart} label="Keyword Volume" />
        <p className="font-heading text-sm font-normal" style={{ color: TEXT_DARK }}>8,100</p>
        <div className="mt-1.5">
          <MiniBars values={[4, 6, 5, 8, 7, 9]} color="#a855f7" />
        </div>
      </DashCard>

      <DashCard id="pagespeed" loose={{ pos: { top: '4%', right: '3%', width: '24%' }, from: { x: 14, y: -6, scale: 0.95 }, delay: 0.1 }} className="flex items-center gap-2">
        <Donut percent={88} color="#a855f7" size={38} />
        <div>
          <CardLabel icon={Zap} label="PageSpeed" />
          <p className="font-heading text-xs font-normal" style={{ color: TEXT_DARK }}>Fast</p>
        </div>
      </DashCard>

      {/* Fills the column directly under Traffic Growth, closing the gap that
          was left empty when only the bottom row sat down there. */}
      <DashCard id="score" loose={{ pos: { top: '30%', left: '3%', width: '24%' }, from: { x: -4, y: 10, scale: 0.95 }, delay: 0.15 }} className="flex items-center gap-2">
        <Donut percent={92} color="#d946ef" size={38} />
        <div>
          <CardLabel icon={Gauge} label="SEO Score" />
          <p className="font-heading text-xs font-normal" style={{ color: TEXT_DARK }}>Excellent</p>
        </div>
      </DashCard>

      <DashCard id="backlinks" loose={{ pos: { top: '26%', right: '3%', width: '24%' }, from: { x: 16, y: 0, scale: 0.95 }, delay: 0.2 }}>
        <CardLabel icon={Link2} label="Backlinks" />
        <p className="font-heading text-sm font-normal" style={{ color: TEXT_DARK }}>2,340</p>
        <div className="mt-1 flex items-center gap-1 text-[9px]" style={{ color: '#22c55e' }}>
          <ArrowUpRight size={10} />
          +18%
        </div>
      </DashCard>

      <DashCard
        id="search"
        loose={{ pos: { top: '48%', left: '30%', width: '30%', transform: 'translate(-50%, -50%)' }, from: { scale: 0.9 }, delay: 0.25 }}
        className="flex items-center gap-2 !rounded-full px-4 py-2"
      >
        <Search size={13} style={{ color: TEXT_MUTED }} />
        <span className="flex-1 text-left text-xs" style={{ color: TEXT_MUTED }}>Analyze your site...</span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full text-white" style={{ background: ACCENT_GRADIENT }}>
          <ArrowRight size={11} />
        </span>
      </DashCard>

      <DashCard
        id="sources"
        loose={{ pos: { top: '62%', right: '4%', width: '30%' }, from: { x: 14, y: 6, scale: 0.95 }, delay: 0.3 }}
        className="flex items-center gap-2"
      >
        <Donut percent={55} color="#7c3aed" size={38} />
        <div>
          <CardLabel icon={PieChart} label="Traffic Sources" />
          <div className="flex items-center gap-1.5">
            {[['Organic', '#7c3aed'], ['Direct', '#d946ef'], ['Referral', '#f472b6']].map(([label, color]) => (
              <span key={label} className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            ))}
          </div>
        </div>
      </DashCard>

      <DashCard id="pages" loose={{ pos: { bottom: '4%', left: '12%', width: '32%' }, from: { x: -14, y: 12, scale: 0.95 }, delay: 0.35 }}>
        <CardLabel icon={Table2} label="Top Pages" />
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-normal" style={{ color: TEXT_DARK }}>/blog/seo-guide</span>
          <StatusBadge status="Growing" />
        </div>
      </DashCard>
    </div>
  )
}

function AssembledLayout() {
  return (
    <motion.div
      className="absolute inset-0 flex"
      style={{ transformOrigin: 'center' }}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
    >
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center gap-2 px-3.5 py-2" style={{ background: HEADER_BG, borderBottom: '1px solid rgba(150,120,170,0.12)' }}>
          <span className="font-heading text-xs font-normal" style={{ color: TEXT_DARK }}>SEO Dashboard</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: CARD_BG, color: TEXT_MUTED }}>
              <Search size={11} />
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: CARD_BG, color: TEXT_MUTED }}>
              <Bell size={11} />
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ background: ACCENT_GRADIENT }}>
              <User size={11} />
            </span>
          </div>
        </div>

        {/* Grid body */}
        <div className="grid flex-1 grid-cols-2 gap-2 p-2.5 sm:grid-cols-4">
          <DashCard id="search" className="col-span-2 flex items-center gap-2 !rounded-full px-4 py-2 sm:col-span-4">
            <Search size={13} style={{ color: TEXT_MUTED }} />
            <span className="flex-1 text-left text-xs" style={{ color: TEXT_MUTED }}>Analyze your site...</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ background: ACCENT_GRADIENT }}>
              <ArrowRight size={12} />
            </span>
          </DashCard>

          {/* Big traffic chart, with a floating value tooltip over the line */}
          <DashCard id="traffic" className="relative col-span-2 row-span-2 overflow-hidden sm:col-span-2">
            <CardLabel icon={TrendingUp} label="Traffic Growth" />
            <p className="font-heading text-lg font-normal" style={{ color: TEXT_DARK }}>+68%</p>
            <p className="text-[9px]" style={{ color: TEXT_MUTED }}>vs. last 30 days</p>
            <div className="relative mt-2 h-14 w-full">
              <svg viewBox="0 0 112 48" preserveAspectRatio="none" className="h-full w-full">
                <defs>
                  <linearGradient id="traffic-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d946ef" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${CHART_PATH} L110,46 L2,46 Z`} fill="url(#traffic-fill)" />
                <path d={CHART_PATH} fill="none" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span
                className="absolute -top-1 right-4 rounded-md px-1.5 py-0.5 text-[8px] font-normal shadow"
                style={{ background: DONUT_HOLE, color: TEXT_DARK }}
              >
                8.4K
              </span>
            </div>
          </DashCard>

          <DashCard id="score" className="col-span-1 flex items-center gap-2.5 sm:col-span-2">
            <Donut percent={92} color="#d946ef" />
            <div>
              <CardLabel icon={Gauge} label="SEO Score" />
              <p className="font-heading text-sm font-normal" style={{ color: TEXT_DARK }}>Excellent</p>
            </div>
          </DashCard>

          <DashCard id="keyword" className="col-span-1 sm:col-span-2">
            <CardLabel icon={LineChart} label="Keyword Volume" />
            <p className="font-heading text-sm font-normal" style={{ color: TEXT_DARK }}>8,100 / mo</p>
            <div className="mt-1.5">
              <MiniBars values={[4, 6, 5, 8, 7, 9]} color="#a855f7" />
            </div>
          </DashCard>

          <DashCard id="pagespeed" className="col-span-1 flex items-center gap-2.5 sm:col-span-2">
            <Donut percent={88} color="#a855f7" />
            <div>
              <CardLabel icon={Zap} label="PageSpeed" />
              <p className="font-heading text-sm font-normal" style={{ color: TEXT_DARK }}>Fast</p>
            </div>
          </DashCard>

          <DashCard id="backlinks" className="col-span-1 sm:col-span-2">
            <CardLabel icon={Link2} label="Backlinks" />
            <p className="font-heading text-sm font-normal" style={{ color: TEXT_DARK }}>2,340</p>
            <div className="mt-1 flex items-center gap-1 text-[9px]" style={{ color: '#22c55e' }}>
              <ArrowUpRight size={10} />
              +18% this month
            </div>
          </DashCard>

          <DashCard id="sources" className="col-span-2 flex items-center gap-3 sm:col-span-4">
            <Donut percent={55} color="#7c3aed" />
            <CardLabel icon={PieChart} label="Traffic Sources" />
            <div className="ml-auto flex items-center gap-4">
              {[['Organic', '#7c3aed'], ['Direct', '#d946ef'], ['Referral', '#f472b6']].map(([label, color]) => (
                <div key={label} className="flex items-center gap-1.5 text-[9px]" style={{ color: TEXT_MUTED }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </DashCard>

          <DashCard id="pages" className="col-span-2 sm:col-span-4">
            <CardLabel icon={Table2} label="Top Pages" />
            <div className="mt-1 space-y-1.5">
              {PAGE_ROWS.map((row) => (
                <div key={row.page} className="flex items-center justify-between gap-2 text-[9px]">
                  <span className="flex-1 truncate" style={{ color: TEXT_DARK }}>{row.page}</span>
                  <span style={{ color: TEXT_MUTED }}>{row.clicks}</span>
                  <span style={{ color: TEXT_MUTED }}>{row.ctr}</span>
                  <StatusBadge status={row.status} />
                  {row.trend === 'up'
                    ? <ArrowUpRight size={11} style={{ color: '#22c55e' }} />
                    : <ArrowDownRight size={11} style={{ color: '#ef4444' }} />}
                </div>
              ))}
            </div>
          </DashCard>
        </div>
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
  '--dash-donut-hole': '#f7f3fc',
  '--dash-donut-track': 'rgba(107, 91, 122, 0.16)',
}
const DASH_VARS_DARK = {
  '--dash-text': '#f5f3ff',
  '--dash-text-muted': '#c9b8dc',
  '--dash-card-bg': 'rgba(255, 255, 255, 0.07)',
  '--dash-header-bg': 'rgba(255, 255, 255, 0.05)',
  '--dash-donut-hole': '#1c1424',
  '--dash-donut-track': 'rgba(255, 255, 255, 0.12)',
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
  // Logo/prompt stay centered; only the loose/assembled dashboard shifts left.
  const isDashboardPhase = phase === 'assembling' || isDashboardVisible

  return (
    <div
      className={`h-full w-full overflow-hidden select-none ${className}`}
      style={isDark ? DASH_VARS_DARK : DASH_VARS_LIGHT}
    >
      {/* No background of its own — the site-wide PageBackground (rendered once
          in Layout.jsx, behind the navbar and every section) already shows
          through here. This component is now just the animated foreground:
          logo → prompt → cards assembling. */}

      {/* Flashes the *entire* stage white during the logo's zoom-through exit —
          must live at this level (not inside the fixed-size stage below), otherwise
          it only lights up that smaller centered box and looks like a floating card */}
      {!reduceMotion && <WhiteFlash />}

      {/* Content stage — kept to a contained size so cards/dashboard don't stretch
          across the full viewport height now that this component is a full-bleed
          section rather than a small card. */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div
          className={`relative h-[400px] w-full max-w-2xl transition-transform duration-700 ease-out sm:h-[440px] lg:h-[480px] lg:max-w-3xl ${
            isDashboardPhase ? 'lg:-translate-x-[10%] xl:-translate-x-[16%]' : ''
          }`}
        >
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
