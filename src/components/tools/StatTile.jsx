import { motion } from 'framer-motion'

// Same glass-card language as the marketing/dashboard cards (TiltCard) —
// a colored top accent and a soft themed glow — scaled down to a compact
// stat readout, with a quiet fade-and-rise entrance instead of just
// appearing instantly once a tool's result data lands.
export default function StatTile({ stat, label, accent = 'var(--color-primary)' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-border bg-surface-card/70 px-5 py-4 text-center backdrop-blur-md"
      style={{ boxShadow: '0 4px 20px var(--glow)' }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
      <p className="font-heading text-2xl font-normal" style={{ color: accent }}>{stat}</p>
      <p className="mt-1 text-xs text-text-muted">{label}</p>
    </motion.div>
  )
}
