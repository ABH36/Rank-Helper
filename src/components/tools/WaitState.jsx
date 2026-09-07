import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

// A pulsing glow halo behind the spinner plus a trio of small bubbles
// rising in sequence underneath — the same "deep sea" language as the
// hero/footer's glowing bubbles, just scaled down to a loading moment
// instead of decoration.
export default function WaitState({ label = 'Working…', note }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface-card/70 px-6 py-14 text-center backdrop-blur-md glow-md"
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)' }}
          animate={{ scale: [0.8, 1.35, 0.8], opacity: [0.6, 0.15, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <Loader2 size={28} className="relative animate-spin text-primary" />
      </div>

      <div>
        <p className="font-heading text-lg font-normal text-text">{label}</p>
        {note && <p className="mt-1 max-w-sm text-sm text-text-muted">{note}</p>}
      </div>

      <div className="flex items-center gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ y: [0, -6, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  )
}
