import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import PageBackground from '../common/PageBackground'

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-text selection:bg-primary/30 selection:text-primary">
      {/* Persistent ribbon backdrop — fixed behind the navbar and every section,
          so there's no per-section boundary for the navbar to visually clash
          with (the same design DashboardAssembly's hero animation settles into). */}
      <PageBackground />

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
