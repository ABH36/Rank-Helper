import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Container from './Container'

const VIDEO_SRC = '/videos/footer-loop.mp4'
const POSTER_SRC = '/videos/footer-loop-poster.jpg'

// A premium looping video strip filling the same spot the footer's ArcGlow
// arc bookend used to sit in. Two things make it work in both themes and
// keep it off Lighthouse's radar:
//   1. The video's own hard rectangular edges dissolve into whatever the
//      current theme's surface color is (white in light mode, near-black in
//      dark) via top/bottom gradients built from var(--color-surface) —
//      so it reads as an intentional part of the page instead of a foreign
//      dark rectangle, in either theme, with zero per-theme video grading.
//   2. Nothing is fetched until this strip actually scrolls into view — it
//      sits at the very bottom of a long page, so eagerly loading ~1.2MB of
//      video on every visit (most of whom never scroll this far) would be
//      pure waste. `preload="none"` plus not rendering a <source> at all
//      until IntersectionObserver fires keeps zero video bytes on the wire
//      for the initial page load.
export default function FooterVideoStrip() {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative h-[200px] w-full overflow-hidden sm:h-[260px] lg:h-[300px]">
      {isVisible && !reduceMotion ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={POSTER_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      ) : (
        <img src={POSTER_SRC} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      )}

      {/* Scrim so the caption stays legible over whatever's playing beneath it */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

      {/* Edge fades into the surrounding theme surface — the trick that
          makes this look intentional in both light and dark mode. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16"
        style={{ background: 'linear-gradient(to bottom, var(--color-surface) 0%, transparent 100%)' }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
        style={{ background: 'linear-gradient(to top, var(--color-surface) 0%, transparent 100%)' }}
      />

      <Container className="pointer-events-none absolute inset-x-0 bottom-0 pb-4 sm:pb-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/75 sm:text-xs">
          Deep Search Intelligence
        </p>
        <p className="mt-1 font-heading text-sm font-normal text-white sm:text-base">
          AI that explores every corner of the search ocean
        </p>
      </Container>
    </div>
  )
}
