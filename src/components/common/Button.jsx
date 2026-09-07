import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BUTTON_MOTION_VARIANTS, SWEEP_TRANSITION, SWEEP_VARIANTS } from './buttonMotion'

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-primary to-accent-lime text-on-primary font-normal shadow-[0_0_24px_var(--glow-lime)] hover:shadow-[0_0_36px_var(--glow-lime)]',
  glow:
    'bg-gradient-to-r from-primary-emerald to-primary text-on-primary font-normal shadow-[0_0_24px_var(--glow)] hover:shadow-[0_0_36px_var(--glow)]',
  secondary:
    'bg-primary/10 text-text hover:bg-primary-emerald/20 border border-primary/20 hover:border-primary/40',
  outline:
    'border border-primary/25 bg-primary/5 backdrop-blur-md text-text hover:bg-primary/10 hover:border-primary/50 hover:text-primary',
  ghost:
    'bg-primary/5 text-text-muted hover:text-primary hover:bg-primary/10',
}

const SIZES = {
  sm: 'px-4 py-2 text-xs rounded-full font-normal',
  md: 'px-6 py-3 text-sm rounded-full font-normal',
  lg: 'px-8 py-3.5 text-base rounded-full font-normal',
  pill: 'px-8 py-3.5 text-base rounded-full font-normal',
}

export default function Button({
  as: As = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  // Memoized so the same motion-wrapped component identity survives
  // re-renders (recreating motion(As) inline would remount the element
  // and drop its animation/gesture state every render).
  const MotionAs = useMemo(() => motion.create(As), [As])

  return (
    <MotionAs
      whileHover="hover"
      whileTap="tap"
      initial="rest"
      // Hover/rest settle through a near-critically-damped spring (smooth,
      // barely any overshoot) so lifting off and releasing a tap both glide
      // rather than snap. Tap-down itself stays a touch stiffer so the
      // press still reads as instant, responsive feedback — only the
      // motion *back* out of it is what needed slowing down.
      variants={BUTTON_MOTION_VARIANTS}
      className={`group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 select-none ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {/* Diagonal light sweep — a single pass on hover, the same
          "premium SaaS button" micro-interaction used across the site */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-white/25"
        variants={SWEEP_VARIANTS}
        transition={SWEEP_TRANSITION}
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </MotionAs>
  )
}
