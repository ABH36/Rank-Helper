import { useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

// Both themes share the same glowing-ribbon background design — only the base
// field color and whether the star dots show differ. Light mode: a flat pale
// violet field. Dark mode: near-black with a violet tint.
const LIGHT_RIBBON_BG = 'linear-gradient(to right, #f2eefb 0%, #f2eefb 100%)'
const DARK_RIBBON_BG = 'radial-gradient(ellipse 90% 70% at 25% 15%, #180f2e 0%, #0c0718 55%, #07040f 100%)'

// A faint scatter of star-like dots — only shown over the dark field, since
// they'd be invisible against the light lavender field.
const STAR_DOTS = [
  ['8%', '12%', 3, 0.6], ['15%', '30%', 2, 0.4], ['22%', '8%', 2, 0.5],
  ['30%', '46%', 3, 0.35], ['12%', '62%', 2, 0.45], ['38%', '22%', 2, 0.3],
  ['5%', '78%', 3, 0.5], ['45%', '65%', 2, 0.35], ['18%', '88%', 2, 0.4],
]

// Slow bubbles rising the full height of the viewport, spread across its
// width — the same "deep sea" bubble motif used inside individual sections,
// now a persistent ambient layer behind the entire app instead of scoped to
// just the hero/footer/services.
const BUBBLES = [
  { left: '6%', size: 5, duration: 15, delay: 0 },
  { left: '18%', size: 3, duration: 19, delay: 4 },
  { left: '34%', size: 6, duration: 17, delay: 8 },
  { left: '52%', size: 4, duration: 21, delay: 1.5 },
  { left: '67%', size: 3, duration: 16, delay: 10 },
  { left: '81%', size: 5, duration: 20, delay: 5.5 },
  { left: '92%', size: 4, duration: 18, delay: 12 },
]

function ribbon(width, height, rotate, translate, colors, glow) {
  return {
    className: 'absolute rounded-full',
    style: {
      width,
      height,
      background: `linear-gradient(90deg, ${colors})`,
      transform: `rotate(${rotate}deg) translate(${translate})`,
      filter: `drop-shadow(0 0 30px ${glow})`,
    },
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE BACKGROUND — the site's persistent backdrop, fixed behind everything
   (navbar included) so there's no section boundary for the navbar to clash
   with. Glowing violet ribbons arc up from the bottom-right corner over a
   subtle film-grain texture, on a pale-violet (light) or near-black (dark)
   field. Three "underwater" cues layer on top of the original flat design:
   a slow-drifting caustic light wash (like sunlight shifting through water),
   bubbles rising the full height of the screen, and a gentle cursor-driven
   3D tilt on the ribbons themselves so they read as sitting at real depth
   rather than painted flat on the page.
═══════════════════════════════════════════════════════════════════════════ */
export default function PageBackground() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const reduceMotion = useReducedMotion()

  // Same mouse-parallax approach as the hero's own arc tilt, just much
  // gentler — this sits behind every page, so it needs to read as ambient
  // depth, never as something fighting for attention.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 40, damping: 22, mass: 0.9 })
  const springY = useSpring(pointerY, { stiffness: 40, damping: 22, mass: 0.9 })
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4])

  useEffect(() => {
    if (reduceMotion) return undefined
    const handleMove = (e) => {
      pointerX.set(e.clientX / window.innerWidth - 0.5)
      pointerY.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [reduceMotion, pointerX, pointerY])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: isDark ? DARK_RIBBON_BG : LIGHT_RIBBON_BG, perspective: 1400 }}
    >
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Caustic light wash — two soft glows drifting slowly past each
          other, like sunlight shifting on the floor of shallow water. Pure
          CSS animation (not Framer Motion's animate()) — this runs forever
          for the life of the page, and a compositor-driven keyframe costs
          nothing on the main thread once started, unlike a JS-ticked value. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${reduceMotion ? '' : 'animate-caustic-drift'}`}
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 28% 22%, rgba(167,139,250,0.12) 0%, transparent 65%), radial-gradient(ellipse 45% 38% at 74% 68%, rgba(96,165,250,0.10) 0%, transparent 65%)',
          mixBlendMode: isDark ? 'screen' : 'multiply',
        }}
      />

      {isDark && STAR_DOTS.map(([top, left, size, opacity], i) => (
        <span
          key={i}
          className={`absolute rounded-full bg-white ${reduceMotion ? '' : 'animate-twinkle'}`}
          style={{
            top,
            left,
            width: size,
            height: size,
            opacity: reduceMotion ? opacity : undefined,
            '--twinkle-lo': opacity * 0.5,
            '--twinkle-hi': opacity,
            animationDuration: `${3.5 + (i % 4)}s`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Bubbles rising the full height of the viewport — same pure-CSS
          approach, capped so they never render for reduced-motion users. */}
      {!reduceMotion && BUBBLES.map((b, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full bg-blue-200 animate-bubble-rise"
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

      {/* Scaled down on small screens (anchored to the bottom-right corner via
          transform-origin) so the ribbons don't overwhelm a narrow viewport —
          same shapes/offsets as before, just smaller before growing to full
          size from sm+. The whole group tilts gently with the cursor for a
          real sense of depth instead of sitting flat on the page. */}
      <motion.div
        className="absolute inset-0 origin-bottom-right scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.45) 0%, transparent 70%)' }}
        />
        <div className="absolute -bottom-24 -right-24 h-[420px] w-[620px]">
          <div {...ribbon('560px', '96px', -30, '20px, 60px', '#4c1d95, #7c3aed, #c4b5fd', 'rgba(139,92,246,0.4)')} />
          <div {...ribbon('520px', '80px', -18, '60px, 130px', '#5b21b6, #8b5cf6, #ddd6fe', 'rgba(139,92,246,0.35)')} />
          <div {...ribbon('480px', '64px', -6, '110px, 210px', '#3b0764, #6d28d9, #a78bfa', 'rgba(139,92,246,0.3)')} />
        </div>
      </motion.div>
    </div>
  )
}
