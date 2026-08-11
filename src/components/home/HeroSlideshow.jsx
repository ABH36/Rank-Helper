import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Braces, ClipboardCheck, FileCode2, FileText, Gauge, LineChart, Percent, Search, Tags } from 'lucide-react'

// One slide per tool in Services.jsx — same 9 modules, same icons, kept in sync.
// Visuals are generated locally (gradient + pattern + icon) — no external image
// requests, so nothing depends on a third-party CDN being reachable/unblocked.
const SLIDES = [
  { icon: Search, title: 'Keyword Research', stat: '12,400+ keywords analyzed daily', accent: 'primary', axis: 'y', pattern: 'dots' },
  { icon: FileText, title: 'Content Generator', stat: '2,000-word articles in under 60s', accent: 'lime', axis: 'x', pattern: 'lines' },
  { icon: ClipboardCheck, title: 'Technical Audit', stat: '7-point instant health score', accent: 'emerald', axis: 'y', pattern: 'rings' },
  { icon: Gauge, title: 'PageSpeed Insights', stat: 'Core Web Vitals in seconds', accent: 'orange', axis: 'x', pattern: 'dots' },
  { icon: Tags, title: 'Meta Tag Generator', stat: 'AI-assisted, instant preview', accent: 'primary', axis: 'y', pattern: 'lines' },
  { icon: Braces, title: 'Schema Markup', stat: 'JSON-LD, ready to paste', accent: 'lime', axis: 'x', pattern: 'rings' },
  { icon: Percent, title: 'On-Page Score', stat: '7-point on-page check', accent: 'emerald', axis: 'y', pattern: 'dots' },
  { icon: FileCode2, title: 'robots.txt Analyzer', stat: 'Crawl-safety in one scan', accent: 'orange', axis: 'x', pattern: 'lines' },
  { icon: LineChart, title: 'Search Console Insights', stat: 'Live GSC data sync', accent: 'primary', axis: 'y', pattern: 'rings' },
]

// Gradients always resolve to a fixed dark backdrop (not the theme's `bg` token) —
// this panel is a deliberately dark hero visual in both light and dark site themes,
// since the overlaid headline text is hardcoded light to sit on top of it.
const ACCENT_CLASSES = {
  primary: {
    icon: 'border-primary/40 bg-primary/20 text-primary',
    text: 'text-primary',
    gradient: 'from-primary-emerald via-[#060a06] to-black',
    glow: 'bg-primary/40',
  },
  lime: {
    icon: 'border-accent-lime/40 bg-accent-lime/20 text-accent-lime',
    text: 'text-accent-lime',
    gradient: 'from-primary via-[#060a06] to-black',
    glow: 'bg-accent-lime/35',
  },
  emerald: {
    icon: 'border-primary-emerald/40 bg-primary-emerald/20 text-primary-emerald',
    text: 'text-primary-emerald',
    gradient: 'from-primary-bright via-[#060a06] to-black',
    glow: 'bg-primary-emerald/40',
  },
  orange: {
    icon: 'border-accent-orange/40 bg-accent-orange/20 text-accent-orange',
    text: 'text-accent-orange',
    gradient: 'from-accent-orange via-[#0a0806] to-black',
    glow: 'bg-accent-orange/35',
  },
}

const HOLD_MS = 4000
const HINGE_DEG = 55
const SPRING = { type: 'spring', stiffness: 80, damping: 16, mass: 1 }
const SPRING_REDUCED = { duration: 0.5, ease: 'easeInOut' }

function PatternLayer({ pattern, uid }) {
  if (pattern === 'dots') {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
        <pattern id={`${uid}-dots`} width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="currentColor" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#${uid}-dots)`} />
      </svg>
    )
  }
  if (pattern === 'lines') {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-[0.12]" aria-hidden="true">
        <pattern id={`${uid}-lines`} width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="36" stroke="currentColor" strokeWidth="1.5" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#${uid}-lines)`} />
      </svg>
    )
  }
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.16]" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx="20%"
          cy="30%"
          r={i * 60}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}

function SlideVisual({ slide }) {
  const Icon = slide.icon
  const accent = ACCENT_CLASSES[slide.accent]
  const uid = useId()
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${accent.gradient}`}>
      <div className={accent.text}>
        <PatternLayer pattern={slide.pattern} uid={uid} />
      </div>
      <div className={`absolute h-72 w-72 rounded-full blur-[110px] ${accent.glow}`} style={{ left: '15%', top: '20%' }} />
      <div className="absolute inset-0 bg-black/30" />
      <span className={`absolute right-8 bottom-8 flex h-20 w-20 items-center justify-center rounded-3xl border backdrop-blur-md sm:h-24 sm:w-24 ${accent.icon}`}>
        <Icon size={40} strokeWidth={1.5} />
      </span>
    </div>
  )
}

function Half({ slide, half, axis, exitAxis, reduceMotion }) {
  const clipPath =
    axis === 'y'
      ? half === 'a'
        ? 'inset(0 0 50% 0)'
        : 'inset(50% 0 0 0)'
      : half === 'a'
        ? 'inset(0 50% 0 0)'
        : 'inset(0 0 0 50%)'

  // Hinge line sits on the seam between the two halves, so each half rotates
  // in 3D like a door/book-page swinging open from that shared edge.
  const transformOrigin =
    axis === 'y' ? (half === 'a' ? 'center bottom' : 'center top') : half === 'a' ? 'right center' : 'left center'

  const sign = half === 'a' ? -1 : 1

  const poseFor = (moveAxis) => {
    if (reduceMotion) return { opacity: 0 }
    if (moveAxis === 'y') return { y: `${sign * 100}%`, rotateX: sign * HINGE_DEG, opacity: 1 }
    return { x: `${sign * 100}%`, rotateY: -sign * HINGE_DEG, opacity: 1 }
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{ clipPath, transformOrigin, transformPerspective: 1400 }}
      initial={poseFor(axis)}
      animate={{ x: 0, y: 0, rotateX: 0, rotateY: 0, opacity: 1 }}
      exit={poseFor(exitAxis)}
      transition={reduceMotion ? SPRING_REDUCED : SPRING}
    >
      <SlideVisual slide={slide} />
    </motion.div>
  )
}

export default function HeroSlideshow({ className = '' }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, HOLD_MS)
    return () => clearInterval(id)
  }, [paused])

  const slide = SLIDES[index]
  const Icon = slide.icon
  const accent = ACCENT_CLASSES[slide.accent]
  const exitAxis = slide.axis === 'y' ? 'x' : 'y'

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ perspective: 1600 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence>
        <motion.div key={index} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          <Half slide={slide} half="a" axis={slide.axis} exitAxis={exitAxis} reduceMotion={reduceMotion} />
          <Half slide={slide} half="b" axis={slide.axis} exitAxis={exitAxis} reduceMotion={reduceMotion} />
        </motion.div>
      </AnimatePresence>

      {/* Very light wash — headline/paragraph now use text-shadow for contrast instead
          of relying on darkening the whole visual, so the animation stays vivid.
          Only the very top (behind the nav) and bottom (behind the caption card)
          get extra darkening. */}
      <div className="absolute inset-0 bg-black/8" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

      {/* Synced caption card, bottom-left */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center p-4 sm:justify-start sm:p-8" style={{ perspective: 1000 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16, rotateX: reduceMotion ? 0 : -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -16, rotateX: reduceMotion ? 0 : 20 }}
            transition={{ ...(reduceMotion ? SPRING_REDUCED : SPRING), delay: reduceMotion ? 0 : 0.3 }}
            style={{ transformOrigin: 'bottom center' }}
            className="w-full max-w-xs rounded-2xl border border-white/15 bg-black/50 p-4 text-left shadow-xl backdrop-blur-xl sm:max-w-sm"
          >
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accent.icon}`}>
                <Icon size={18} />
              </span>
              <div>
                <h3 className="font-heading text-sm font-bold text-white">{slide.title}</h3>
                <p className={`text-xs font-semibold ${accent.text}`}>{slide.stat}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
