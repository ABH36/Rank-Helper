import ahrefsLogo from '../../assets/logos/ahrefs.png'
import semrushLogo from '../../assets/logos/semrush.png'
import mozLogo from '../../assets/logos/moz.png'
import gscLogo from '../../assets/logos/gsc.png'
import screamingFrogLogo from '../../assets/logos/screamingfrog.png'
import surferSeoLogo from '../../assets/logos/surferseo.png'
import clearscopeLogo from '../../assets/logos/clearscope.png'
import brightEdgeLogo from '../../assets/logos/brightedge.png'
import seRankingLogo from '../../assets/logos/seranking.png'
import mangoolsLogo from '../../assets/logos/mangools.png'

// Pure CSS infinite marquee — no external dependency, zero CJS/ESM issues
const LOGOS = [
  { name: 'Ahrefs',         logo: ahrefsLogo },
  { name: 'SEMrush',        logo: semrushLogo },
  { name: 'Moz Pro',        logo: mozLogo },
  { name: 'Google GSC',     logo: gscLogo },
  { name: 'Screaming Frog', logo: screamingFrogLogo },
  { name: 'Surfer SEO',     logo: surferSeoLogo },
  { name: 'Clearscope',     logo: clearscopeLogo },
  { name: 'BrightEdge',     logo: brightEdgeLogo },
  { name: 'SE Ranking',     logo: seRankingLogo },
  { name: 'Mangools',       logo: mangoolsLogo },
]

// We duplicate the list so the CSS loop looks seamless
const TRACK = [...LOGOS, ...LOGOS]

export default function LogoMarquee({ className = '' }) {
  return (
    <div className={`relative overflow-hidden py-6 ${className}`}>
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-bg to-transparent" />

      {/* Label */}
      <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-text-muted">
        Works alongside your favourite tools
      </p>

      {/* Scrolling track */}
      <div
        className="flex gap-4"
        style={{
          animation: 'marqueeScroll 28s linear infinite',
          width: 'max-content',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {TRACK.map(({ name, logo }, i) => (
          <div
            key={`${name}-${i}`}
            className="flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-surface-card/70 px-5 py-2.5 text-sm font-semibold text-text-secondary shadow-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:text-primary hover:shadow-[0_0_14px_var(--glow)]"
          >
            <img src={logo} alt={name} className="h-5 w-5 shrink-0 rounded-md object-contain" draggable={false} />
            <span>{name}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
