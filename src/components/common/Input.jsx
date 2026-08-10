import { ChevronDown } from 'lucide-react'

export function PillSelect({ label, value, onChange, options = [], className = '' }) {
  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-text-muted px-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-full border border-border bg-surface-2/80 px-5 py-3 text-xs sm:text-sm text-text transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt} className="bg-surface text-text">
              {opt.label || opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
        />
      </div>
    </div>
  )
}

export default function Input({ label, className = '', ...props }) {
  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-text-muted px-1">
          {label}
        </label>
      )}
      <input
        className="w-full rounded-full border border-border bg-surface-2/80 px-5 py-3 text-xs sm:text-sm text-text transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-text-muted/60"
        {...props}
      />
    </div>
  )
}
