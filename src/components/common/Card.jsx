import { motion } from 'framer-motion'

// A quiet fade-and-rise on mount — every result panel across the app (tables,
// stat grids, cluster lists) uses this one component, so animating it here
// once gives every tool's results a premium "settling into place" entrance
// with no per-page changes needed.
export default function Card({ className = '', hoverGlow = true, children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border border-border bg-surface-card/90 backdrop-blur-md p-6 shadow-sm transition-all duration-200 ${
        hoverGlow
          ? 'hover:border-border-strong hover:shadow-[0_8px_30px_var(--glow)] hover:-translate-y-1'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

