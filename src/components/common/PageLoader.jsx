import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function PageLoader({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'var(--bg)' }}
        >
          {/* Pulsing brand mark */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-emerald to-primary shadow-[0_0_40px_var(--glow)] text-[#061006]"
          >
            <Sparkles size={30} />
          </motion.div>

          {/* Brand name */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-5 font-heading text-sm font-bold tracking-widest text-text-muted uppercase"
          >
            Rank<span className="text-primary">Helper</span>
          </motion.p>

          {/* Loading bar */}
          <div className="mt-6 h-0.5 w-32 overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary-emerald to-accent-lime"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
