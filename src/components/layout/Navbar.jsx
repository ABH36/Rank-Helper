import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Sparkles, X } from 'lucide-react'
import Container from '../common/Container'
import Button from '../common/Button'
import ThemeToggle from '../common/ThemeToggle'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
]

function navLinkClass({ mobile = false } = {}) {
  if (mobile) {
    return 'rounded-full border border-border bg-surface-2/50 px-4 py-2.5 text-sm text-center font-heading font-semibold tracking-wide text-text-muted transition-all hover:border-white/20 hover:bg-white/10 hover:text-text'
  }
  return 'rounded-full px-4 py-1.5 text-xs font-heading font-semibold tracking-wide whitespace-nowrap text-text-muted transition-all hover:bg-white/10 hover:text-text'
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-3 z-50 px-3 sm:top-4 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl rounded-2xl border-2 border-border-strong bg-bg/85 shadow-lg shadow-[var(--glow)] backdrop-blur-xl transition-colors">
        <Container className="flex h-16 items-center justify-between gap-3">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5 font-heading text-lg font-bold text-text">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-emerald to-primary text-[#061006] shadow-md shadow-[var(--glow)] transition-transform group-hover:scale-105">
              <Sparkles size={18} className="animate-pulse" />
            </span>
            <span className="tracking-tight">
              Rank<span className="text-primary font-extrabold">Helper</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-border bg-surface-2/40 p-1.5 md:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={navLinkClass()}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
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
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border-2 border-border-strong bg-surface/95 shadow-lg backdrop-blur-2xl md:hidden">
          <Container className="flex flex-col gap-2 py-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={navLinkClass({ mobile: true })}
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
