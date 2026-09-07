import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

const MotionLink = motion.create(Link)

// Same tap spring Button.jsx uses — a touch stiffer than the hover spring so
// the press itself still reads as instant, responsive feedback.
const TAP_TRANSITION = { type: 'spring', stiffness: 420, damping: 24, mass: 0.5 }
// How long the flip has to visibly play before the route actually changes —
// long enough to read as a real animation, short enough it never feels like
// the click was ignored.
const FLIP_MS = 420

// Where each card starts before it "deals" into place — as if a hand of
// cards were fanned out above the grid and thrown down into position, not
// identical copies of one slide-up. Computed off each card's column
// (assuming a 4-column layout — the fan looks slightly less exact at
// narrower breakpoints where columns collapse, but the motion is fast
// enough that isn't noticeable) so cards on the left fan out from the
// upper-right and cards on the right fan out from the upper-left, both
// converging toward the grid like they were dealt from a shared point
// above center.
const DEAL_COLUMNS = 4
function getDealFrom(index) {
  const col = index % DEAL_COLUMNS
  const centerOffset = col - (DEAL_COLUMNS - 1) / 2 // negative = left column, positive = right
  const flip = index % 2 === 0 ? 1 : -1
  return {
    x: centerOffset * -90,
    y: -140 - Math.abs(centerOffset) * 18,
    rotate: centerOffset * -14 + flip * 5,
    scale: 0.55,
  }
}

// A glass "gem" card with a genuine 3D tilt that follows the cursor (not
// just a flat hover-lift) and a spotlight glow that tracks the pointer
// across the surface — the two things that make a card feel like it's
// actually reacting to you rather than just having a hover state. Built
// with the same spring tuning proven smooth on the site's buttons
// (stiffness/damping chosen to settle without jitter, see Button.jsx),
// applied here to rotateX/rotateY instead of scale. Shared by the
// marketing Services grid and the authenticated Dashboard's tool grid so
// both read as the exact same card, not two similar-looking copies that
// drift apart over time — `children` supplies whatever footer each needs
// (a stat readout vs. an "Open" affordance).
export default function TiltCard({ icon: Icon, title, description, accent, index = 0, to, children }) {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [isOpening, setIsOpening] = useState(false)
  const flipTimer = useRef(null)

  useEffect(() => () => clearTimeout(flipTimer.current), [])

  // 0..1 across the card's own width/height — reset to the centered 0.5
  // on mouse-leave so the tilt eases back to flat instead of snapping.
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const springX = useSpring(px, { stiffness: 260, damping: 26, mass: 0.7 })
  const springY = useSpring(py, { stiffness: 260, damping: 26, mass: 0.7 })
  const rotateX = useTransform(springY, [0, 1], [8, -8])
  const rotateY = useTransform(springX, [0, 1], [-8, 8])
  const glowX = useTransform(springX, (v) => `${v * 100}%`)
  const glowY = useTransform(springY, (v) => `${v * 100}%`)
  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${glowX} ${glowY}, color-mix(in srgb, ${accent} 20%, transparent), transparent 75%)`

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }
  const handleLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  // Clicking opens the destination with a card-flip transition instead of
  // navigating instantly: the whole card rotates away edge-on and fades,
  // then the route changes right as it's edge-on (invisible) so the cut
  // reads as seamless rather than a jarring instant swap. Reduced-motion
  // users skip straight to the plain Link navigation.
  //
  // `preventDefault` runs on every click, not just the first — a second
  // click landing while the flip is still playing (an easy thing to do
  // when nothing about a screen changing for the AI feels instant) must
  // never fall through to the browser's own instant navigation, which
  // would cut the animation off mid-flip and undo the whole point of it.
  // Only the actual state change/timer is guarded to a single run.
  const handleClick = (e) => {
    if (reduceMotion) return
    e.preventDefault()
    if (isOpening) return
    setIsOpening(true)
    flipTimer.current = setTimeout(() => navigate(to), FLIP_MS)
  }

  const dealFrom = getDealFrom(index)

  return (
    <motion.div
      initial={{ opacity: 0, x: dealFrom.x, y: dealFrom.y, rotate: dealFrom.rotate, scale: dealFrom.scale }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        type: 'spring',
        stiffness: 180,
        damping: 17,
        mass: 0.9,
        delay: index * 0.07,
      }}
      className="h-full"
    >
      <div style={{ perspective: 1000 }} className="h-full">
        {/* Flip wrapper — a separate 3D layer from the cursor-tilt one below
            it, so the click-triggered flip and the pointer-driven tilt never
            fight over the same rotateY value. */}
        <motion.div
          className="h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={isOpening ? { rotateY: -100, opacity: 0, scale: 0.85 } : { rotateY: 0, opacity: 1, scale: 1 }}
          transition={{ duration: FLIP_MS / 1000, ease: [0.6, 0, 0.9, 0.2] }}
        >
          <MotionLink
            to={to}
            onClick={handleClick}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            initial={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            whileHover={{
              y: -8,
              scale: 1.02,
              boxShadow: `0 28px 52px -18px color-mix(in srgb, ${accent} 50%, transparent)`,
              transition: { type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] },
            }}
            whileTap={{ scale: 0.96, transition: TAP_TRANSITION }}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              background:
                'linear-gradient(155deg, rgba(255,255,255,0.05) 0%, rgba(30,64,175,0.07) 45%, rgba(76,29,149,0.1) 100%)',
              border: '1px solid rgba(191,219,254,0.18)',
            }}
            className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-6 text-left backdrop-blur-md"
          >
            {/* Spotlight that follows the cursor across the glass surface */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: spotlight }}
            />

            {/* Top accent line */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1"
              style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
            />

            {/* Content lifted slightly in Z so it visibly separates from the
                tilting card surface beneath it — a subtle but real depth cue
                since the parent has transformStyle: preserve-3d. */}
            <div className="relative" style={{ transform: 'translateZ(36px)' }}>
              {/* Glass-bubble icon badge — same specular-highlight language as
                  the hero's bubbles, glowing brighter on hover like a little
                  gem catching light, with two tiny orbiting motes that fade
                  in around it. */}
              <div className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110">
                <div
                  className="absolute inset-0 rounded-2xl transition-shadow duration-300"
                  style={{
                    background: `radial-gradient(circle at 30% 25%, color-mix(in srgb, ${accent} 45%, transparent) 0%, color-mix(in srgb, ${accent} 14%, transparent) 65%, transparent 100%)`,
                    boxShadow: `0 0 0 1px color-mix(in srgb, ${accent} 30%, transparent), inset 0 1px 1px rgba(255,255,255,0.4)`,
                  }}
                />
                <span
                  className="absolute left-[22%] top-[18%] h-1 w-1 rounded-full bg-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ filter: 'blur(0.3px)' }}
                />
                <Icon size={20} className="relative" style={{ color: accent }} />
                <span
                  className="pointer-events-none absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full opacity-0 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:opacity-100"
                  style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
                />
                <span
                  className="pointer-events-none absolute -bottom-1 -left-1 h-1 w-1 rounded-full opacity-0 transition-all delay-75 duration-500 group-hover:translate-y-1 group-hover:opacity-100"
                  style={{ background: accent, boxShadow: `0 0 5px ${accent}` }}
                />
              </div>
              <h3 className="font-heading text-lg font-normal text-text">{title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{description}</p>
            </div>

            {children}
          </MotionLink>
        </motion.div>
      </div>
    </motion.div>
  )
}
