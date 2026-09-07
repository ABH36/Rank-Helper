import { Link } from 'react-router-dom'
import logoIcon from '../../assets/logo/logo-icon.webp'

export default function Logo({ className = '', iconOnly = false, to = '/' }) {
  return (
    <Link to={to} className={`group flex shrink-0 items-center gap-2.5 font-heading text-lg font-normal text-text ${className}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center drop-shadow-[0_0_10px_var(--glow)] transition-transform group-hover:scale-105">
        <img src={logoIcon} alt="" className="h-full w-full object-contain" />
      </span>
      {!iconOnly && (
        <span className="tracking-tight">
          Rank<span className="text-primary font-normal">Helper</span>
        </span>
      )}
    </Link>
  )
}
