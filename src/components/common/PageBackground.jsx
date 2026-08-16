import { useTheme } from '../../context/ThemeContext'

// Both themes share the same glowing-ribbon background design — only the base
// field color and whether the star dots show differ. Light mode: a flat pale
// lavender field. Dark mode: near-black.
const LIGHT_RIBBON_BG = 'linear-gradient(to right, #eae5fb 0%, #eae5fb 100%)'
const DARK_RIBBON_BG = 'radial-gradient(ellipse 90% 70% at 25% 15%, #1c0f24 0%, #0a0710 55%, #050308 100%)'

// A faint scatter of star-like dots — only shown over the dark field, since
// they'd be invisible against the light lavender field.
const STAR_DOTS = [
  ['8%', '12%', 3, 0.6], ['15%', '30%', 2, 0.4], ['22%', '8%', 2, 0.5],
  ['30%', '46%', 3, 0.35], ['12%', '62%', 2, 0.45], ['38%', '22%', 2, 0.3],
  ['5%', '78%', 3, 0.5], ['45%', '65%', 2, 0.35], ['18%', '88%', 2, 0.4],
]

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE BACKGROUND — the site's persistent backdrop, fixed behind everything
   (navbar included) so there's no section boundary for the navbar to clash
   with. Glowing magenta ribbons arc up from the bottom-right corner over a
   subtle film-grain texture, on a lavender (light) or near-black (dark)
   field. This is the same visual language DashboardAssembly's hero animation
   settles into, just applied site-wide instead of scoped to one section.
═══════════════════════════════════════════════════════════════════════════ */
export default function PageBackground() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const ribbon = (width, height, rotate, translate, colors, glow) => ({
    className: 'absolute rounded-full',
    style: {
      width,
      height,
      background: `linear-gradient(90deg, ${colors})`,
      transform: `rotate(${rotate}deg) translate(${translate})`,
      filter: `drop-shadow(0 0 30px ${glow})`,
    },
  })

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: isDark ? DARK_RIBBON_BG : LIGHT_RIBBON_BG }}
    >
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {isDark && STAR_DOTS.map(([top, left, size, opacity], i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ top, left, width: size, height: size, opacity }}
        />
      ))}
      {/* Scaled down on small screens (anchored to the bottom-right corner via
          transform-origin) so the ribbons don't overwhelm a narrow viewport —
          same shapes/offsets as before, just smaller before growing to full
          size from sm+. */}
      <div className="absolute inset-0 origin-bottom-right scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100">
        <div
          className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.45) 0%, transparent 70%)' }}
        />
        <div className="absolute -bottom-24 -right-24 h-[420px] w-[620px]">
          <div {...ribbon('560px', '96px', -30, '20px, 60px', '#6b21a8, #c026d3, #f0abfc', 'rgba(217,70,239,0.4)')} />
          <div {...ribbon('520px', '80px', -18, '60px, 130px', '#86198f, #d946ef, #f5d0fe', 'rgba(217,70,239,0.35)')} />
          <div {...ribbon('480px', '64px', -6, '110px, 210px', '#581c87, #a21caf, #e879f9', 'rgba(217,70,239,0.3)')} />
        </div>
      </div>
    </div>
  )
}
