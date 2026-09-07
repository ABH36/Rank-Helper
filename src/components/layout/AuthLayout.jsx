import { Outlet } from 'react-router-dom'
import PageBackground from '../common/PageBackground'
import Navbar from './Navbar'
import Container from '../common/Container'
import Card from '../common/Card'
import ArcGlow from '../common/ArcGlow'

// A few drifting motes around the auth card — same deep-sea ambience as
// every marketing section, so logging in/signing up doesn't feel like a
// separate, unstyled part of the app.
const MOTES = [
  { left: '10%', top: '20%', size: 5, delay: 0 },
  { left: '88%', top: '16%', size: 4, delay: 1.2 },
  { left: '14%', top: '78%', size: 4, delay: 2.1 },
  { left: '90%', top: '72%', size: 5, delay: 0.7 },
]

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-text selection:bg-primary/30 selection:text-primary">
      <PageBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        {/* Scoped to just this centering wrapper (not the whole, possibly
            taller-than-viewport page) so the glow anchors to the bottom of
            what's actually visible — Signup's longer form still gets the
            same bookend instead of it landing off-screen below the fold. */}
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden py-12">
          <ArcGlow variant="footer" className="-z-10" />
          {MOTES.map((m, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="pointer-events-none absolute -z-10 rounded-full bg-blue-200 animate-float-slow animate-pulse-glow"
              style={{ left: m.left, top: m.top, width: m.size, height: m.size, animationDelay: `${m.delay}s` }}
            />
          ))}

          <Container className="flex w-full max-w-md flex-col items-center">
            <Card hoverGlow={false} className="w-full sm:p-8">
              <Outlet />
            </Card>
          </Container>
        </div>
      </div>
    </div>
  )
}
