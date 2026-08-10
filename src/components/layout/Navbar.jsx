import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Menu, Sparkles, X } from 'lucide-react'
import Container from '../common/Container'
import Button from '../common/Button'
import ThemeToggle from '../common/ThemeToggle'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Features', href: '#features' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/75 backdrop-blur-xl transition-colors">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5 font-heading text-lg font-bold text-text">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-emerald to-primary text-[#061006] shadow-md shadow-[var(--glow)] transition-transform group-hover:scale-105">
            <Sparkles size={18} className="animate-pulse" />
          </span>
          <span className="tracking-tight">
            SEO<span className="text-primary font-extrabold">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-surface/50 p-1.5 backdrop-blur-md md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-xs font-semibold text-text-muted transition-all hover:bg-surface-2 hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button as={Link} to="/login" variant="ghost" size="sm">
            Log in
          </Button>
          <Button as={Link} to="/signup" variant="primary" size="sm">
            Get Started
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface/60 text-text"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-border bg-surface/95 backdrop-blur-2xl md:hidden">
          <Container className="flex flex-col gap-4 py-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-text-muted hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              <Button as={Link} to="/login" variant="outline" size="sm">
                Log in
              </Button>
              <Button as={Link} to="/signup" variant="primary" size="sm">
                Get Started
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}

