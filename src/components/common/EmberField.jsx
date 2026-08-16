import { useEffect, useRef } from 'react'

const EMBER_COUNT_PER_1000PX2 = 0.012
const MAX_EMBERS = 55

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

function spawnEmber(W, H) {
  return {
    x: Math.random() * W,
    y: H + Math.random() * 60,
    vy: -(0.25 + Math.random() * 0.55),
    sway: 0.4 + Math.random() * 0.8,
    swayPhase: Math.random() * Math.PI * 2,
    r: 1 + Math.random() * 2.2,
    maxAlpha: 0.35 + Math.random() * 0.5,
    life: 0,
    maxLife: 260 + Math.random() * 220,
  }
}

export default function EmberField({ className = '', color = '#ff5722' }) {
  const canvasRef = useRef(null)
  const rgb = hexToRgb(color)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let embers = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(devicePixelRatio, devicePixelRatio)
      seed()
    }

    const seed = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      const count = Math.min(MAX_EMBERS, Math.round(((W * H) / 1000) * EMBER_COUNT_PER_1000PX2))
      embers = Array.from({ length: count }, () => {
        const e = spawnEmber(W, H)
        e.y = Math.random() * H // spread initial positions through the whole height
        e.life = Math.random() * e.maxLife
        return e
      })
    }

    const step = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      embers.forEach((e, i) => {
        e.life += 1
        e.y += e.vy
        e.swayPhase += 0.02
        const x = e.x + Math.sin(e.swayPhase) * e.sway

        const lifeRatio = e.life / e.maxLife
        const fade = lifeRatio < 0.15 ? lifeRatio / 0.15 : lifeRatio > 0.85 ? (1 - lifeRatio) / 0.15 : 1
        const alpha = Math.max(0, e.maxAlpha * fade)

        ctx.beginPath()
        ctx.arc(x, e.y, e.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${alpha})`
        ctx.shadowColor = `rgba(${rgb},${Math.min(1, alpha + 0.2)})`
        ctx.shadowBlur = 6 + e.r * 2
        ctx.fill()
        ctx.shadowBlur = 0

        if (e.y < -20 || e.life >= e.maxLife) {
          embers[i] = spawnEmber(W, H)
        }
      })

      animId = requestAnimationFrame(step)
    }

    resize()
    step()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [rgb])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}
