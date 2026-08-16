

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const VARIANTS = {
  'fade-up':    { hidden: { opacity: 0, y: 40 },  visible: { opacity: 1, y: 0 } },
  'fade-down':  { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  'fade-left':  { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  'fade-right': { hidden: { opacity: 0, x: 50 },  visible: { opacity: 1, x: 0 } },
  'fade':       { hidden: { opacity: 0 },          visible: { opacity: 1 } },
  'zoom':       { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
}

/**
 * RevealBox — wraps children in a motion.div that animates into view.
 *
 * Props:
 *   direction  — 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'fade' | 'zoom'
 *   delay      — seconds, default 0
 *   duration   — seconds, default 0.55
 *   once       — animate only the first time (default true)
 *   threshold  — IntersectionObserver margin (default 0.15)
 */
export default function RevealBox({
  direction = 'fade-up',
  delay = 0,
  duration = 0.55,
  once = true,
  threshold = 0.15,
  className = '',
  children,
  ...props
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: `0px 0px -${Math.round(threshold * 100)}px 0px` })
  const variant = VARIANTS[direction] ?? VARIANTS['fade-up']

  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
