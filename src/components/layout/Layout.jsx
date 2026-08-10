import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-text selection:bg-primary/30 selection:text-primary">
      {/* Background Ambient Glowing Orbs — subtle, black stays dominant */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-[10%] h-[500px] w-[700px] rounded-full bg-primary/10 blur-[140px] dark:bg-primary/[0.08] animate-pulse-glow" />
        <div className="absolute -top-32 right-[5%] h-[400px] w-[500px] rounded-full bg-accent-lime/5 blur-[130px] dark:bg-accent-lime/[0.05]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

