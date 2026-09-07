// A gentle undulating line, like a water surface seen edge-on — the "deep
// sea" motif's edge treatment, used anywhere a section needs to read as
// bookended by water instead of a flat rule (the LogoMarquee strip, the
// About section's lead-in from it, and anywhere else that continuity
// matters). `flip` mirrors it for a bottom edge. `gradientId` must be
// unique per instance on the page — SVG gradient ids are global to the
// document, so two dividers sharing one id would silently pick up
// whichever definition rendered last.
export default function WaveDivider({ flip = false, gradientId, className = '' }) {
  return (
    <svg
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      className={`block h-4 w-full sm:h-5 ${flip ? 'rotate-180' : ''} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(76,29,149,0.08)" />
          <stop offset="50%" stopColor="rgba(139,92,246,0.28)" />
          <stop offset="100%" stopColor="rgba(76,29,149,0.08)" />
        </linearGradient>
      </defs>
      <path
        d="M0,20 C240,38 480,2 720,20 C960,38 1200,2 1440,20 L1440,40 L0,40 Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M0,20 C240,38 480,2 720,20 C960,38 1200,2 1440,20"
        fill="none"
        stroke="rgba(167,139,250,0.55)"
        strokeWidth="1.5"
        style={{ filter: 'drop-shadow(0 0 4px rgba(139,92,246,0.5))' }}
      />
    </svg>
  )
}
