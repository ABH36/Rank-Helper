import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Bell, Gauge, LineChart, Search, Sparkles, Table2, TrendingUp } from 'lucide-react'

const LOGO_MS = 1300
const BUILD_MS = 1400 // how long cards stay "loose" before snapping into the grid
const HOLD_MS = 4500 // how long the assembled dashboard stays visible before resetting

const EASE = [0.22, 1, 0.36, 1]

// Colors matched directly to the reference video (not this site's own purple/black
// brand tokens) — a soft blue-white intro that deepens into a vivid blue → purple →
// pink gradient once the dashboard assembles, with light glassy cards + dark navy text.
const BG_LIGHT = 'linear-gradient(180deg, #dce7fb 0%, #eef2fb 55%, #ffffff 100%)'
const BG_VIVID = 'linear-gradient(135deg, #5865d6 0%, #8b5cd6 45%, #d669c4 100%)'
const ACCENT_GRADIENT = 'linear-gradient(90deg, #5865d6, #a35cd6, #d669c4)'
const CARD_BG = 'rgba(255,255,255,0.92)'
const TEXT_DARK = '#1e2a5e'
const TEXT_MUTED = '#6b7398'

function LogoScene() {
  return (
    <motion.div
      key="logo"
      className="absolute inset-0 flex flex-col items-center justify-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      transition={{ duration: 0.5 }}
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
        style={{ background: ACCENT_GRADIENT }}
      >
        <Sparkles size={26} className="animate-pulse" />
      </span>
      <span className="font-heading text-lg font-bold" style={{ color: TEXT_DARK }}>
        Rank<span style={{ color: '#8b5cd6' }}>Helper</span>
      </span>
    </motion.div>
  )
}

function PromptScene({ onStart }) {
  return (
    <motion.div
      key="prompt"
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-heading text-xl font-bold sm:text-2xl" style={{ color: TEXT_DARK }}>
        Automate Your SEO <span style={{ color: '#8b5cd6' }}>in Minutes</span>
      </p>
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        style={{ background: ACCENT_GRADIENT }}
      >
        Get Started
        <ArrowRight size={16} />
      </button>
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
    <p className="mb-1.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest" style={{ color: TEXT_MUTED }}>
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
        <p className="font-heading text-sm font-extrabold" style={{ color: '#5865d6' }}>+68%</p>
      </DashCard>

      <DashCard id="keyword" loose={{ pos: { top: '4%', right: '4%', width: '34%' }, from: { x: 50, y: -30 } }}>
        <CardLabel icon={LineChart} label="Keyword Volume" />
        <p className="font-heading text-sm font-extrabold" style={{ color: TEXT_DARK }}>8,100</p>
      </DashCard>

      <DashCard id="score" loose={{ pos: { bottom: '5%', left: '5%', width: '36%' }, from: { x: -50, y: 30 } }}>
        <CardLabel icon={Gauge} label="SEO Score" />
        <p className="font-heading text-sm font-extrabold" style={{ color: '#d669c4' }}>92%</p>
      </DashCard>

      <DashCard id="pages" loose={{ pos: { bottom: '4%', right: '4%', width: '40%' }, from: { x: 50, y: 30 } }}>
        <CardLabel icon={Table2} label="Top Pages" />
        <p className="font-heading text-sm font-extrabold" style={{ color: TEXT_DARK }}>/blog/seo-guide</p>
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
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(30,42,94,0.08)' }}>
        <span className="font-heading text-xs font-bold" style={{ color: TEXT_DARK }}>SEO Dashboard</span>
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
          <p className="font-heading text-lg font-extrabold" style={{ color: '#5865d6' }}>+68%</p>
          <p className="text-[9px]" style={{ color: TEXT_MUTED }}>vs. last 30 days</p>
        </DashCard>

        <DashCard id="keyword" className="col-span-1 sm:col-span-2">
          <CardLabel icon={LineChart} label="Keyword Volume" />
          <p className="font-heading text-sm font-extrabold" style={{ color: TEXT_DARK }}>8,100 / mo</p>
        </DashCard>

        <DashCard id="score" className="col-span-1 sm:col-span-2">
          <CardLabel icon={Gauge} label="SEO Score" />
          <p className="font-heading text-lg font-extrabold" style={{ color: '#d669c4' }}>92%</p>
        </DashCard>

        <DashCard id="pages" className="col-span-2">
          <CardLabel icon={Table2} label="Top Pages" />
          <div className="flex items-center justify-between text-[10px]" style={{ color: TEXT_MUTED }}>
            <span style={{ color: TEXT_DARK }}>/blog/seo-guide</span>
            <span style={{ color: '#5865d6', fontWeight: 600 }}>1.2K clicks</span>
          </div>
        </DashCard>
      </div>
    </motion.div>
  )
}

export default function DashboardAssembly({ className = '' }) {
  const [phase, setPhase] = useState('logo') // 'logo' | 'prompt' | 'assembling' | 'assembled'
  const reduceMotion = useReducedMotion()
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    if (reduceMotion) {
      setPhase('assembled')
      return undefined
    }
    timers.current.push(setTimeout(() => setPhase('prompt'), LOGO_MS))
    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion])

  useEffect(() => {
    if (phase !== 'assembling') return undefined
    const t = setTimeout(() => setPhase('assembled'), BUILD_MS)
    timers.current.push(t)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'assembled') return undefined
    const t = setTimeout(() => setPhase('prompt'), HOLD_MS)
    timers.current.push(t)
    return () => clearTimeout(t)
  }, [phase])

  const handleStart = () => setPhase('assembling')
  const isVivid = phase === 'assembling' || phase === 'assembled'

  return (
    <div className={`relative w-full select-none ${className}`}>
      <div className="relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
        <div className="relative h-[380px] w-full overflow-hidden sm:h-[440px]">
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

          <AnimatePresence mode="wait">
            {phase === 'logo' && <LogoScene />}
            {phase === 'prompt' && <PromptScene onStart={handleStart} />}
          </AnimatePresence>

          {phase === 'assembling' && <LooseLayout />}
          {phase === 'assembled' && <AssembledLayout />}
        </div>
      </div>
    </div>
  )
}
