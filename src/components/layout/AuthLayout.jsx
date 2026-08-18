import { Outlet } from 'react-router-dom'
import PageBackground from '../common/PageBackground'
import Navbar from './Navbar'
import Container from '../common/Container'

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-text selection:bg-primary/30 selection:text-primary">
      <PageBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <div className="flex flex-1 flex-col items-center justify-center py-12">
          <Container className="flex w-full max-w-md flex-col items-center">
            <div className="w-full rounded-2xl border border-border bg-surface-card/90 p-6 shadow-sm backdrop-blur-md sm:p-8">
              <Outlet />
            </div>
          </Container>
        </div>
      </div>
    </div>
  )
}
