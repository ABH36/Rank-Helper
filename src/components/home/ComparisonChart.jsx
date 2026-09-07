import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RevealBox from '../common/RevealBox'
import { BUTTON_MOTION_VARIANTS } from '../common/buttonMotion'

const TABS = [
  {
    id: 'keywords',
    label: 'Keyword Speed',
    unit: 'results/sec',
    data: [
      { name: 'RankHelper', value: 98,  color: 'var(--color-primary)' },
      { name: 'Ahrefs',     value: 71,  color: '#64748b' },
      { name: 'SEMrush',    value: 65,  color: '#64748b' },
      { name: 'Moz Pro',    value: 48,  color: '#64748b' },
    ],
  },
  {
    id: 'audit',
    label: 'Audit Speed',
    unit: 'pages/min',
    data: [
      { name: 'RankHelper', value: 95,  color: 'var(--color-primary)' },
      { name: 'Screaming Frog', value: 80, color: '#64748b' },
      { name: 'SEMrush',    value: 58,  color: '#64748b' },
      { name: 'Ahrefs',     value: 52,  color: '#64748b' },
    ],
  },
  {
    id: 'accuracy',
    label: 'AI Accuracy',
    unit: '% match rate',
    data: [
      { name: 'RankHelper', value: 97,  color: 'var(--color-primary)' },
      { name: 'Surfer SEO', value: 79,  color: '#64748b' },
      { name: 'Clearscope', value: 73,  color: '#64748b' },
      { name: 'BrightEdge', value: 61,  color: '#64748b' },
    ],
  },
]

export default function ComparisonChart({ className = '' }) {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const tab = TABS.find((t) => t.id === activeTab)

  return (
    <div className={`rounded-2xl border border-border bg-surface-card/80 p-6 backdrop-blur-md shadow-sm ${className}`}>
      {/* Header */}
      <RevealBox direction="fade-up">
        <p className="mb-1 text-xs font-normal uppercase tracking-widest text-primary">Performance</p>
        <h3 className="font-heading text-xl font-normal text-text">
          How RankHelper compares
        </h3>
      </RevealBox>

      {/* Tab switcher */}
      <RevealBox direction="fade-up" delay={0.1} className="mt-5 flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            whileHover="hover"
            whileTap="tap"
            initial="rest"
            variants={BUTTON_MOTION_VARIANTS}
            className={`relative cursor-pointer rounded-full px-4 py-1.5 text-xs font-normal transition-colors duration-200 ${
              activeTab === t.id
                ? 'bg-primary text-on-primary shadow-[0_0_14px_var(--glow)]'
                : 'border border-border bg-surface-2/60 text-text-muted hover:border-primary/40 hover:text-primary'
            }`}
          >
            {activeTab === t.id && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-primary"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              />
            )}
            {t.label}
          </motion.button>
        ))}
      </RevealBox>

      {/* Bars */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-6 space-y-4"
        >
          {tab.data.map((item, i) => (
            <div key={item.name}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-normal text-text">{item.name}</span>
                <span className="text-xs font-normal" style={{ color: item.color }}>
                  {item.value} {tab.unit}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
