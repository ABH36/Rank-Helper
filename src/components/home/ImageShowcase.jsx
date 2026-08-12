import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import keywordImg from '../../assets/img/keyword.webp'
import contentImg from '../../assets/img/content-generator.webp'
import speedImg from '../../assets/img/pagespeed.webp'
import auditImg from '../../assets/img/audit.webp'

const SLIDES = [
  {
    image: keywordImg,
    title: 'Keyword Research',
    tag: 'Intent · Volume · Difficulty',
  },
  {
    image: contentImg,
    title: 'AI Content Generator',
    tag: 'Research → Plan → Write',
  },
  {
    image: speedImg,
    title: 'Technical Audit',
    tag: 'Site health & crawl issues',
  },
  {
    image: auditImg,
    title: 'On-Page Optimization',
    tag: 'Meta tags & structured data',
  },
]

const HOLD_MS = 4200
const DOOR_TRANSITION = { duration: 0.75, ease: [0.65, 0, 0.35, 1] }

/* Half of an image, clipped left/right. Outgoing slides use exit (opens away
   from center); incoming slides use initial→animate (closes in from the side). */
function DoorHalf({ src, alt, side }) {
  const clipPath = side === 'left' ? 'inset(0 50% 0 0)' : 'inset(0 0 0 50%)'
  const offscreen = side === 'left' ? '-100%' : '100%'

  return (
    <motion.div
      className="absolute inset-0"
      style={{ clipPath }}
      initial={{ x: offscreen }}
      animate={{ x: 0 }}
      exit={{ x: offscreen }}
      transition={DOOR_TRANSITION}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" draggable={false} />
    </motion.div>
  )
}

export default function ImageShowcase({ className = '' }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), HOLD_MS)
    return () => clearInterval(id)
  }, [paused])

  const slide = SLIDES[index]

  return (
    <div
      className={`relative w-full select-none ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border-strong shadow-xl glass-panel">
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          {reduceMotion ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                draggable={false}
              />
            </AnimatePresence>
          ) : (
            <AnimatePresence>
              <motion.div key={index} className="absolute inset-0">
                <DoorHalf src={slide.image} alt={slide.title} side="left" />
                <DoorHalf src={slide.image} alt={slide.title} side="right" />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Bottom gradient for caption legibility */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Caption */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
              >
                <p className="font-heading text-sm font-bold text-white">{slide.title}</p>
                <p className="text-[11px] text-white/70">{slide.tag}</p>
              </motion.div>
            </AnimatePresence>

            {/* Pagination dots */}
            <div className="flex shrink-0 items-center gap-1.5 pb-1">
              {SLIDES.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${s.title}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === index ? 'w-5 bg-primary' : 'w-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
