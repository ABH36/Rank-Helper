export default function Card({ className = '', hoverGlow = true, children, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface-card/90 backdrop-blur-md p-6 shadow-sm transition-all duration-200 ${
        hoverGlow
          ? 'hover:border-border-strong hover:shadow-[0_8px_30px_var(--glow)] hover:-translate-y-1'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

