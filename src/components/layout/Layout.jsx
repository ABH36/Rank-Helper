import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-text selection:bg-primary/30 selection:text-primary">
      {/* Fixed ambient glow orbs — sit behind everything */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-[8%] h-[480px] w-[640px] rounded-full bg-primary/8 blur-[160px] animate-pulse-glow" />
        <div className="absolute top-[20%] right-[2%] h-[360px] w-[480px] rounded-full bg-accent-lime/5 blur-[140px]" />
        <div className="absolute bottom-[10%] left-[25%] h-[300px] w-[400px] rounded-full bg-primary-bright/6 blur-[120px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
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
