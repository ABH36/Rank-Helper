import { useEffect, useRef } from 'react'

const PARTICLE_COUNT_PER_1000PX2 = 0.018 // density scales with canvas area
const MAX_PARTICLES = 70
const LINK_DISTANCE = 130
const DRIFT_SPEED = 0.18
const CURSOR_RADIUS = 150

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

export default function ConstellationGrid({ className = '', color = '#d946ef' }) {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const rgb = hexToRgb(color)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(devicePixelRatio, devicePixelRatio)
      buildParticles()
    }

    const buildParticles = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      const count = Math.min(MAX_PARTICLES, Math.round(((W * H) / 1000) * PARTICLE_COUNT_PER_1000PX2))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * DRIFT_SPEED,
        vy: (Math.random() - 0.5) * DRIFT_SPEED,
        r: 1 + Math.random() * 1.2,
      }))
    }

    const step = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      const mx = mouse.current.x
      const my = mouse.current.y

      // Move + draw particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        p.x = Math.max(0, Math.min(W, p.x))
        p.y = Math.max(0, Math.min(H, p.y))

        const distToCursor = Math.hypot(p.x - mx, p.y - my)
        const proximity = Math.max(0, 1 - distToCursor / CURSOR_RADIUS)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r + proximity * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${0.35 + proximity * 0.5})`
        ctx.fill()
      })

      // Links between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.22
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${rgb},${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // Links from cursor to nearby particles
      particles.forEach((p) => {
        const dist = Math.hypot(p.x - mx, p.y - my)
        if (dist < CURSOR_RADIUS) {
          const alpha = (1 - dist / CURSOR_RADIUS) * 0.4
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mx, my)
          ctx.strokeStyle = `rgba(${rgb},${alpha})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })

      animId = requestAnimationFrame(step)
    }

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 } }

    resize()
    step()

    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouse)
    canvas.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouse)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [rgb])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full pointer-events-auto ${className}`}
      aria-hidden="true"
    />
  )
}
