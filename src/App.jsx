import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import PageLoader from './components/common/PageLoader'

// Everything past the homepage is code-split into its own chunk, loaded on
// demand — most visitors only ever hit "/", so there's no reason their
// first load should also parse all 9 tool pages' code up front.
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const Dashboard = lazy(() => import('./pages/app/Dashboard'))
const OnPageScore = lazy(() => import('./pages/app/onpage/OnPageScore'))
const MetaTagGenerator = lazy(() => import('./pages/app/metatag/MetaTagGenerator'))
const SchemaMarkup = lazy(() => import('./pages/app/schema/SchemaMarkup'))
const RobotsAnalyzer = lazy(() => import('./pages/app/robots/RobotsAnalyzer'))
const KeywordResearch = lazy(() => import('./pages/app/keyword/KeywordResearch'))
const PageSpeed = lazy(() => import('./pages/app/pagespeed/PageSpeed'))
const TechnicalAudit = lazy(() => import('./pages/app/audit/TechnicalAudit'))
const ContentGenerator = lazy(() => import('./pages/app/content/ContentGenerator'))
const GscDashboard = lazy(() => import('./pages/app/gsc/GscDashboard'))
const ConnectGoogle = lazy(() => import('./pages/app/gsc/ConnectGoogle'))

// React Router doesn't reset scroll on navigation — without this, clicking a
// link from partway down a long page (e.g. a Services card) lands on the new,
// often shorter page at the same scroll offset, which can show blank space
// below its content instead of the page itself.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Brief fallback while a lazy route chunk downloads — only ever seen on a
// slow connection's first visit to a given route, since the browser caches
// the chunk after that.
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <Loader2 size={28} className="animate-spin text-primary" />
    </div>
  )
}

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setTimeout(() => setLoading(false), 900)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <PageLoader visible={loading} />
        <Toaster position="top-center" toastOptions={{
          style: { background: 'var(--color-surface-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' },
        }} />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
              </Route>

              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/app" element={<Dashboard />} />
                  <Route path="/app/onpage" element={<OnPageScore />} />
                  <Route path="/app/meta-tags" element={<MetaTagGenerator />} />
                  <Route path="/app/schema" element={<SchemaMarkup />} />
                  <Route path="/app/robots" element={<RobotsAnalyzer />} />
                  <Route path="/app/keyword" element={<KeywordResearch />} />
                  <Route path="/app/pagespeed" element={<PageSpeed />} />
                  <Route path="/app/audit" element={<TechnicalAudit />} />
                  <Route path="/app/content" element={<ContentGenerator />} />
                  <Route path="/app/gsc" element={<GscDashboard />} />
                  <Route path="/app/gsc/connect" element={<ConnectGoogle />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
