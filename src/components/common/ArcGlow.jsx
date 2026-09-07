// Recreates the VeloSphere reference's signature decoration: a bright vertical
// light beam rising into a wide "horizon" curve, with concentric rings arcing
// up from that same center point beneath it (like ripples/sonar), glowing
// violet. Purely decorative and absolutely positioned — no interaction, so
// it's safe to drop behind any section. Used at the two "bookend" spots the
// reference uses it: behind the hero's dashboard mockup (where the horizon
// sits high, up near the subtitle, and the rings cradle the mockup below),
// and a smaller echo of the same shape above the footer.
const RING_COUNT = 7

const VARIANTS = {
  hero: {
    height: '82%',
    maxRadius: 640,
    // The horizon is just the same family of ring, pushed out so large that
    // only its topmost sliver is visible — reads as a wide, gently-curved
    // line high in the section rather than an obviously circular arc.
    horizonRadius: 2000,
    baseOpacity: 0.55,
    beamWidth: '40%',
    beamHeight: '92%',
  },
  footer: {
    height: 220,
    maxRadius: 480,
    horizonRadius: 900,
    baseOpacity: 0.4,
    beamWidth: '46%',
    beamHeight: 180,
  },
}

export default function ArcGlow({ variant = 'hero', className = '' }) {
  const { height, maxRadius, horizonRadius, baseOpacity, beamWidth, beamHeight } =
    VARIANTS[variant] || VARIANTS.hero

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Vertical light column running the full height of the stage, from the
          horizon down to the point the rings converge on. */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: beamWidth,
          height: beamHeight,
          background: 'linear-gradient(to top, var(--glow-lime) 0%, var(--glow) 45%, transparent 88%)',
          filter: 'blur(3px)',
        }}
      />

      {/* Hot flare where the beam meets the horizon — the reference's bright
          "spotlight" highlight sitting just under the subtitle text. */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: '34%',
          height: '38%',
          background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(196,181,253,0.5) 0%, transparent 72%)',
          filter: 'blur(6px)',
        }}
      />

      {/* Horizon — the outermost, largest ring in the family, brighter and
          thicker than the rest so it reads as a distinct curved skyline. */}
      <div
        className="absolute rounded-full"
        style={{
          left: '50%',
          top: '100%',
          width: horizonRadius * 2,
          height: horizonRadius * 2,
          marginLeft: -horizonRadius,
          marginTop: -horizonRadius,
          border: '1.5px solid rgba(196,181,253,0.55)',
          filter: 'drop-shadow(0 0 18px rgba(139,92,246,0.55))',
        }}
      />

      {/* Concentric arcs — each ring's center sits exactly on the container's
          bottom edge, so overflow-hidden reveals only its top half as an arc,
          nested smallest-to-largest around the same point, cradling whatever
          sits in front of them (the hero's dashboard mockup). */}
      {Array.from({ length: RING_COUNT }).map((_, i) => {
        const r = maxRadius * ((i + 1) / RING_COUNT)
        const opacity = Math.max(baseOpacity - i * 0.06, 0.1)
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: '50%',
              top: '100%',
              width: r * 2,
              height: r * 2,
              marginLeft: -r,
              marginTop: -r,
              border: `1px solid rgba(167,139,250,${opacity})`,
              filter: `drop-shadow(0 0 10px rgba(139,92,246,${opacity * 0.6}))`,
            }}
          />
        )
      })}
    </div>
  )
}
