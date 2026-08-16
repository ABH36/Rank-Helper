import { useEffect, useRef } from 'react'

const DOT_SPACING = 28
const DOT_RADIUS = 1.4
const DOT_BASE_ALPHA = 0.18
const CURSOR_RADIUS = 110       // px — dots inside this glow on cursor move
const TWINKLE_INTERVAL = 80    // ms between random twinkle ticks
const TWINKLE_COUNT = 6        // how many dots twinkle at once
const SHOOT_INTERVAL = 3200    // ms between shooting-star events

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

export default function DotGrid({ className = '', color = '#d946ef' }) {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const rgb = hexToRgb(color)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let twinkleTimer
    let shootTimer
    let twinklingDots = []   // [{col,row,alpha,decay}]
    let shootStar = null     // {x,y,dx,dy,progress}
    let dots = []            // flat array of {x,y}
    let cols, rows

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
      buildGrid()
    }

    const buildGrid = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      cols = Math.ceil(W / DOT_SPACING)
      rows = Math.ceil(H / DOT_SPACING)
      dots = []
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          dots.push({ x: c * DOT_SPACING, y: r * DOT_SPACING })
        }
      }
    }

    const spawnTwinkles = () => {
      for (let i = 0; i < TWINKLE_COUNT; i++) {
        const idx = Math.floor(Math.random() * dots.length)
        twinklingDots.push({ idx, alpha: 0, peak: 0.55 + Math.random() * 0.35, rising: true })
      }
    }

    const spawnShoot = () => {
      if (!dots.length) return
      // pick a random start dot on top-left region, shoot diagonally right-down
      const startRow = Math.floor(Math.random() * (rows * 0.5))
      const startCol = Math.floor(Math.random() * (cols * 0.4))
      shootStar = {
        x: startCol * DOT_SPACING,
        y: startRow * DOT_SPACING,
        dx: DOT_SPACING * 1.1,
        dy: DOT_SPACING * 1.1,
        progress: 0,
        maxLen: 9 + Math.floor(Math.random() * 6),  // how many dots the tail covers
        alpha: 0.9,
      }
    }

    const draw = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      const mx = mouse.current.x
      const my = mouse.current.y

      // Draw regular dots
      dots.forEach(({ x, y }) => {
        const dist = Math.hypot(x - mx, y - my)
        const proximity = Math.max(0, 1 - dist / CURSOR_RADIUS)
        const alpha = DOT_BASE_ALPHA + proximity * 0.55

        ctx.beginPath()
        ctx.arc(x, y, DOT_RADIUS + proximity * 1.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${alpha})`
        ctx.fill()
      })

      // Draw twinkle highlights
      twinklingDots.forEach((t) => {
        const dot = dots[t.idx]
        if (!dot) return
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, DOT_RADIUS * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${t.alpha})`
        // add a tiny glow with shadow
        ctx.shadowColor = `rgba(${rgb},0.7)`
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw shooting star
      if (shootStar) {
        const s = shootStar
        const steps = s.maxLen
        for (let i = 0; i <= steps; i++) {
          const tx = s.x - s.dx * i
          const ty = s.y - s.dy * i
          const tailAlpha = s.alpha * (1 - i / steps)
          const r2 = DOT_RADIUS * (1 - (i / steps) * 0.6)
          ctx.beginPath()
          ctx.arc(tx, ty, r2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${rgb},${tailAlpha})`
          if (i === 0) {
            ctx.shadowColor = `rgba(${rgb},0.9)`
            ctx.shadowBlur = 12
          }
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }

      animId = requestAnimationFrame(draw)
    }

    const updateTwinkles = () => {
      twinklingDots = twinklingDots
        .map((t) => {
          if (t.rising) {
            t.alpha += 0.06
            if (t.alpha >= t.peak) { t.rising = false }
          } else {
            t.alpha -= 0.04
          }
          return t
        })
        .filter((t) => t.alpha > 0)
      spawnTwinkles()
    }

    const updateShoot = () => {
      if (!shootStar) return
      shootStar.x += shootStar.dx
      shootStar.y += shootStar.dy
      shootStar.progress++
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      if (shootStar.x > W + 50 || shootStar.y > H + 50) {
        shootStar = null
      }
    }

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 } }

    // RAF loop for shooting star
    let shootRaf
    const shootLoop = () => {
      updateShoot()
      shootRaf = requestAnimationFrame(shootLoop)
    }

    resize()
    draw()
    shootLoop()

    twinkleTimer = setInterval(() => updateTwinkles(), TWINKLE_INTERVAL)
    shootTimer = setInterval(() => spawnShoot(), SHOOT_INTERVAL)

    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouse)
    canvas.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(animId)
      cancelAnimationFrame(shootRaf)
      clearInterval(twinkleTimer)
      clearInterval(shootTimer)
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
