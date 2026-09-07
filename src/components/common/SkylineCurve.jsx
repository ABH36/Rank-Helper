// A single wide, gently-arced line of light spanning the full width right
// under the navbar — the reference's "horizon" curve that ArcGlow's much
// larger, lower rings don't reach up far enough to read as on their own.
// Pure decoration, absolutely positioned, no interaction.
export default function SkylineCurve({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 overflow-hidden ${className}`}
      style={{ height: 170 }}
    >
      <svg viewBox="0 0 1000 170" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="skyline-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(139,92,246,0)" />
            <stop offset="50%" stopColor="rgba(196,181,253,0.9)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0)" />
          </linearGradient>
        </defs>
        {/* Soft wide bloom beneath the crisp line, same curve, blurred */}
        <path
          d="M0,140 Q500,40 1000,140"
          fill="none"
          stroke="rgba(167,139,250,0.35)"
          strokeWidth="14"
          style={{ filter: 'blur(10px)' }}
        />
        {/* Crisp line on top */}
        <path
          d="M0,140 Q500,40 1000,140"
          fill="none"
          stroke="url(#skyline-fade)"
          strokeWidth="1.5"
          style={{ filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.7))' }}
        />
      </svg>
    </div>
  )
}
