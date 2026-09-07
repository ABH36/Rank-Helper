import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import AnimatedButton from './AnimatedButton'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <AnimatedButton
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface/60 backdrop-blur-md text-text-muted transition-colors duration-300 hover:border-primary/50 hover:bg-surface-2 hover:text-primary ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      <div className="relative h-4 w-4">
        <Sun
          size={16}
          className={`absolute inset-0 transition-all duration-300 ${
            isDark ? 'rotate-0 scale-100 opacity-100 text-amber-400' : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon
          size={16}
          className={`absolute inset-0 transition-all duration-300 ${
            isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100 text-primary'
          }`}
        />
      </div>
    </AnimatedButton>
  )
}
