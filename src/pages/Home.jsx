import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from './home/Hero'
import About from './home/About'
import Services from './home/Services'
import Features from './home/Features'
import PerformanceCli from './home/PerformanceCli'
import LogoMarquee from '../components/common/LogoMarquee'

export default function Home() {
  const { hash } = useLocation()

  // Navbar's Home/Services/About links route here as "/#section" (a real
  // route change from /login, /app/*, etc.) rather than a plain #anchor —
  // once this page mounts, scroll to the matching section ourselves, since
  // client-side navigation doesn't trigger the browser's native hash-jump.
  useEffect(() => {
    if (!hash) return
    const el = document.querySelector(hash)
    if (!el) return
    const id = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(id)
  }, [hash])

  return (
    <>
      {/* ── Hero ── */}
      <Hero />

      {/* ── Logo Marquee (right below hero) — deep-sea strip: wavy top/
          bottom edges, glass-bubble pills, and drifting motes, all styled
          in LogoMarquee.jsx itself rather than wrapped here. ── */}
      <LogoMarquee />

      {/* ── About ── */}
      <About />

      {/* ── Performance & CLI (Comparison Chart + Terminal Card) — deep-sea
          backdrop (wave lead-in, drifting motes, animated glow blobs) now
          lives in PerformanceCli.jsx itself. ── */}
      <PerformanceCli />

      {/* ── Services ── */}
      <Services />

      {/* ── Features — was already fully built and themed but never wired
          into the page, leaving the navbar's "Features" link pointing at
          a nonexistent #features anchor. ── */}
      <Features />
    </>
  )
}
