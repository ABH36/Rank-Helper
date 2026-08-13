import { Sparkles } from 'lucide-react'
import Container from '../common/Container'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface/60 backdrop-blur-xl">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2.5 font-heading text-sm font-normal text-text">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-emerald to-primary text-[#061006] shadow-sm">
            <Sparkles size={14} />
          </span>
          <span>
            Rank<span className="text-primary font-normal">Helper</span>
          </span>
        </div>
        <p className="text-xs text-text-muted">
          &copy; {year} RankHelper. All rights reserved. Powered by AI-driven search intelligence.
        </p>
      </Container>
    </footer>
  )
}

