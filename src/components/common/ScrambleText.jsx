import { useRef, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

/**
 * ScrambleText — wraps any text string in a span that scramble-decodes on hover.
 * Usage:  <ScrambleText text="Get Started" />
 *         <ScrambleText text="Log in" tag="span" className="..." />
 */
export default function ScrambleText({ text, tag: Tag = 'span', className = '', ...props }) {
  const elRef = useRef(null)
  const frameRef = useRef(null)
  const iterRef = useRef(0)

  const scramble = useCallback(() => {
    const el = elRef.current
    if (!el) return
    cancelAnimationFrame(frameRef.current)
    iterRef.current = 0
    const original = text
    const totalFrames = original.length * 3   // ~3 frames per char to fully resolve

    const tick = () => {
      iterRef.current += 0.6
      const resolved = Math.floor(iterRef.current)

      el.textContent = original
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (i < resolved) return original[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      if (resolved < original.length) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        el.textContent = original  // fully resolved
      }
    }

    frameRef.current = requestAnimationFrame(tick)
  }, [text])

  const reset = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    if (elRef.current) elRef.current.textContent = text
  }, [text])

  return (
    <Tag
      ref={elRef}
      className={className}
      onMouseEnter={scramble}
      onMouseLeave={reset}
      {...props}
    >
      {text}
    </Tag>
  )
}
