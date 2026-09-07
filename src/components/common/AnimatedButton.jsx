import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BUTTON_MOTION_VARIANTS, SWEEP_TRANSITION, SWEEP_VARIANTS } from './buttonMotion'

// The same hover-lift/tap-press spring and diagonal "water" light-sweep as
// Button.jsx, for every other clickable control that needs its own full
// className control (tab toggles with active/inactive states, icon-only
// buttons/links, list items) — trying to force those through Button.jsx's
// fixed variant/size classes would mean fighting Tailwind's utility cascade
// to override colors that don't reliably win by source order alone. This
// component carries none of Button.jsx's color opinions, just the motion.
// `as` mirrors Button.jsx's own prop so icon-only <Link>s (e.g. a "back
// home" glyph sitting next to a hamburger button) can carry the identical
// animation instead of looking inconsistent beside it.
export default function AnimatedButton({ as: As = 'button', className = '', sweepClassName = '', children, ...props }) {
  const MotionAs = useMemo(() => motion.create(As), [As])
  const typeProp = As === 'button' ? { type: 'button' } : {}

  return (
    <MotionAs
      {...typeProp}
      whileHover="hover"
      whileTap="tap"
      initial="rest"
      variants={BUTTON_MOTION_VARIANTS}
      className={`group relative cursor-pointer overflow-hidden select-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-white/25 ${sweepClassName}`}
        variants={SWEEP_VARIANTS}
        transition={SWEEP_TRANSITION}
      />
      <span className="relative">{children}</span>
    </MotionAs>
  )
}
