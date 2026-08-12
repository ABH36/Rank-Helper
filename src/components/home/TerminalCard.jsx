import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const LINES = [
  { type: 'cmd',  text: '$ rankhelper audit --url https://mysite.com' },
  { type: 'info', text: '  ⠿ Crawling 247 pages...' },
  { type: 'ok',   text: '  ✓ Sitemap found  →  /sitemap.xml' },
  { type: 'ok',   text: '  ✓ robots.txt valid  →  no blocks detected' },
  { type: 'warn', text: '  ⚠ 14 pages missing meta descriptions' },
  { type: 'warn', text: '  ⚠ 3 broken internal links found' },
  { type: 'cmd',  text: '$ rankhelper keywords --seed "AI SEO tool"' },
  { type: 'info', text: '  ⠿ Fetching search data...' },
  { type: 'ok',   text: '  ✓ 1,240 keyword suggestions generated' },
  { type: 'ok',   text: '  ✓ Low-competition cluster: 87 keywords' },
  { type: 'ok',   text: '  ✓ Report saved  →  results/keywords.csv' },
]

const COLOR = {
  cmd:  'text-primary font-bold',
  info: 'text-text-muted',
  ok:   'text-fuchsia-400',
  warn: 'text-amber-400',
}

const CHAR_DELAY = 18   // ms per character
const LINE_PAUSE = 280  // ms after each line before starting next
const RESTART_DELAY = 2800

export default function TerminalCard({ className = '' }) {
  const [visibleLines, setVisibleLines] = useState([])  // [{...line, display: string}]
  const [cursor, setCursor] = useState(true)
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { once: false, margin: '0px 0px -80px 0px' })
  const runRef = useRef(false)

  // Blink cursor
  useEffect(() => {
    const id = setInterval(() => setCursor((c) => !c), 500)
    return () => clearInterval(id)
  }, [])

  // Typewriter engine
  useEffect(() => {
    if (!inView) return
    if (runRef.current) return
    runRef.current = true

    let cancelled = false
    let timeouts = []

    const schedule = (fn, delay) => {
      const id = setTimeout(fn, delay)
      timeouts.push(id)
      return id
    }

    const run = () => {
      setVisibleLines([])
      let totalDelay = 200

      LINES.forEach((line, lineIdx) => {
        const chars = line.text.split('')
        // Reveal line container after delay
        schedule(() => {
          if (cancelled) return
          setVisibleLines((prev) => [...prev, { ...line, display: '' }])
        }, totalDelay)

        // Type each character
        chars.forEach((_, charIdx) => {
          totalDelay += CHAR_DELAY
          schedule(() => {
            if (cancelled) return
            setVisibleLines((prev) =>
              prev.map((l, i) =>
                i === lineIdx ? { ...l, display: line.text.slice(0, charIdx + 1) } : l
              )
            )
          }, totalDelay)
        })

        totalDelay += LINE_PAUSE
      })

      // Restart loop
      schedule(() => {
        if (cancelled) return
        runRef.current = false
        run()
      }, totalDelay + RESTART_DELAY)
    }

    run()

    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
      runRef.current = false
    }
  }, [inView])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl border border-border bg-[#0a0610] shadow-[0_0_60px_rgba(217,70,239,0.06)] ${className}`}
    >
      {/* Terminal header bar */}
      <div className="flex items-center gap-2 border-b border-border/40 bg-[#0c0814] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-amber-400/70" />
        <span className="h-3 w-3 rounded-full bg-fuchsia-500/70" />
        <span className="ml-3 text-xs font-mono font-semibold text-text-muted">
          rankhelper — CLI v2.0
        </span>
      </div>

      {/* Terminal body */}
      <div className="min-h-[260px] p-5 font-mono text-[0.78rem] leading-relaxed">
        {visibleLines.map((line, i) => (
          <div key={i} className={`${COLOR[line.type]}`}>
            {line.display}
            {/* Show blinking cursor on last line */}
            {i === visibleLines.length - 1 && (
              <span
                className="ml-0.5 inline-block w-[7px] h-[13px] align-middle bg-primary"
                style={{ opacity: cursor ? 1 : 0, transition: 'opacity 0.1s' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
