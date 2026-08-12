const VARIANTS = {
  primary:
    'bg-gradient-to-r from-primary to-accent-lime text-[#061006] font-semibold shadow-[0_0_24px_var(--glow-lime)] hover:shadow-[0_0_32px_var(--glow-lime)] hover:-translate-y-0.5 active:translate-y-0',
  glow:
    'bg-gradient-to-r from-primary-emerald to-primary text-[#061006] font-semibold shadow-[0_0_24px_var(--glow)] hover:shadow-[0_0_32px_var(--glow)] hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-primary/10 text-text hover:bg-primary-emerald/20 border border-primary/20 hover:border-primary/40',
  outline:
    'border border-primary/25 bg-primary/5 backdrop-blur-md text-text hover:bg-primary/10 hover:border-primary/50 hover:text-primary',
  ghost:
    'bg-primary/5 text-text-muted hover:text-primary hover:bg-primary/10',
}

const SIZES = {
  sm: 'px-4 py-2 text-xs rounded-full font-semibold',
  md: 'px-6 py-3 text-sm rounded-full font-bold',
  lg: 'px-8 py-3.5 text-base rounded-full font-extrabold',
  pill: 'px-8 py-3.5 text-base rounded-full font-extrabold',
}

export default function Button({
  as: As = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <As
      className={`inline-flex cursor-pointer items-center justify-center gap-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 select-none ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {children}
    </As>
  )
}


