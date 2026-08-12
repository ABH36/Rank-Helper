import React from 'react'

const VARIANTS = {
  emerald: 'bg-primary/10 text-primary dark:text-[#F0ABFC] border-primary/20',
  lime: 'bg-accent-lime/10 text-accent-lime border-accent-lime/25',
  slate: 'bg-surface-2/70 text-text-secondary border-border',
}

export default function Badge({ variant = 'emerald', className = '', children, ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-sm transition-colors ${VARIANTS[variant] || VARIANTS.emerald} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
