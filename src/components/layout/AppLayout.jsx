import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Home, LayoutGrid, LogOut, Menu, X } from 'lucide-react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { APP_NAV_ITEMS } from '../../config/tools'
import PageBackground from '../common/PageBackground'
import Logo from '../common/Logo'
import ThemeToggle from '../common/ThemeToggle'
import Button from '../common/Button'
import AnimatedButton from '../common/AnimatedButton'
import ToolSearch from './ToolSearch'

// One link — the active one gets a sliding glass highlight (a single shared
// `layoutId`, so it glides from wherever it used to be to its new spot
// instead of just popping into place) tinted with that tool's own accent
// color, plus a matching icon badge, instead of every item sharing one flat
// active color.
function SidebarLink({ to, end, icon: Icon, title, accent = 'var(--color-primary)', onNavigate, pillId }) {
  return (
    <NavLink to={to} end={end} onClick={onNavigate} className="group relative block">
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId={pillId}
              className="absolute inset-0 rounded-xl"
              style={{
                background: `color-mix(in srgb, ${accent} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)`,
                boxShadow: `0 0 18px color-mix(in srgb, ${accent} 25%, transparent)`,
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          )}
          <span
            className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isActive ? '' : 'text-text-muted group-hover:bg-surface-2/60 group-hover:text-text'
            }`}
            style={isActive ? { color: accent } : undefined}
          >
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300"
              style={isActive ? { background: `color-mix(in srgb, ${accent} 18%, transparent)` } : undefined}
            >
              <Icon size={16} />
            </span>
            {title}
          </span>
        </>
      )}
    </NavLink>
  )
}

// Whichever tool is currently open rises to sit right under Dashboard —
// clicking a section brings it to that same "just opened" spot every time,
// with the whole list smoothly reflowing (`layout` on each wrapper) rather
// than jumping. Recomputed from the route on every render, so it always
// reflects the actually-active tool rather than a separate click history.
// `groupId` namespaces the shared layoutId — the desktop sidebar stays
// mounted (just CSS-hidden below `lg`) at the same time the mobile
// slide-over is open, so without separate ids the two would fight over one
// shared highlight animation.
function SidebarLinks({ onNavigate, groupId }) {
  const location = useLocation()
  const activeItem = APP_NAV_ITEMS.find((item) => location.pathname.startsWith(item.route))
  const orderedItems = activeItem
    ? [activeItem, ...APP_NAV_ITEMS.filter((item) => item !== activeItem)]
    : APP_NAV_ITEMS
  const pillId = `sidebar-active-pill-${groupId}`

  return (
    <LayoutGroup id={groupId}>
      <nav className="flex flex-col gap-1">
        <SidebarLink to="/app" end icon={LayoutGrid} title="Dashboard" onNavigate={onNavigate} pillId={pillId} />
        {orderedItems.map((item) => (
          <motion.div key={item.route} layout transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
            <SidebarLink to={item.route} icon={item.icon} title={item.title} accent={item.accent} onNavigate={onNavigate} pillId={pillId} />
          </motion.div>
        ))}
      </nav>
    </LayoutGroup>
  )
}

// Signed-in user + logout — lives at the bottom of the sidebar (desktop and
// mobile). Theme toggle lives in the top header instead (next to search),
// not duplicated here.
function SidebarFooter({ user, onLogout }) {
  return (
    <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4">
      <span className="min-w-0 truncate text-xs text-text-muted">{user?.username}</span>
      <Button variant="ghost" size="sm" onClick={onLogout} className="shrink-0 whitespace-nowrap">
        <LogOut size={15} />
        Log out
      </Button>
    </div>
  )
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative flex min-h-screen bg-bg text-text selection:bg-primary/30 selection:text-primary">
      <PageBackground />

      {/* Desktop sidebar — sticky + its own scroll, so it stays put while
          the main content scrolls. A soft underwater wash and a couple of
          drifting motes give it the same deep-sea ambience as everywhere
          else, instead of a flat panel. */}
      <aside className="sticky top-0 z-10 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface/60 px-4 py-6 backdrop-blur-md lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(180deg, rgba(96,165,250,0.05) 0%, transparent 35%, transparent 65%, rgba(124,58,237,0.06) 100%)' }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full bg-blue-200 animate-float-slow animate-pulse-glow"
          style={{ left: '78%', top: '14%', width: 4, height: 4 }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full bg-blue-200 animate-float animate-pulse-glow"
          style={{ left: '12%', top: '55%', width: 3, height: 3, animationDelay: '1.4s' }}
        />

        <Logo className="mb-8 px-1" />
        <SidebarLinks groupId="desktop" />
        <SidebarFooter user={user} onLogout={handleLogout} />
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* App header — logo on the left (mirrors the home page), tool
            search + theme toggle grouped together on the right. */}
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <AnimatedButton
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface/60 text-text transition-colors hover:border-primary/40 lg:hidden"
          >
            <Menu size={18} />
          </AnimatedButton>

          <AnimatedButton
            as={Link}
            to="/"
            aria-label="Back to home"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface/60 text-text transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Home size={18} />
          </AnimatedButton>

          <div className="flex flex-1 items-center justify-end gap-3">
            <ToolSearch className="w-full max-w-sm" />
            <ThemeToggle className="shrink-0" />
          </div>
        </header>

        <main className="relative flex-1 overflow-hidden px-4 py-6 sm:px-6 lg:px-10">
          {/* Same deep-sea ambience as the marketing pages — a couple of
              soft drifting glow blobs tucked into the corners, subtle
              enough not to compete with the tool content sitting on top. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full blur-[100px] animate-float-slow animate-pulse-glow"
            style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.16) 0%, transparent 70%)' }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-24 -z-10 h-72 w-72 rounded-full blur-[100px] animate-float animate-pulse-glow"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 70%)' }}
          />

          {/* Each route change plays a quick "surfacing into focus" beat —
              fade, rise and un-blur — instead of an instant content swap,
              picking up right where the clicked card's flip transition
              leaves off. */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile slide-over sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto border-r border-border bg-surface px-4 py-6 shadow-xl lg:hidden"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{ background: 'linear-gradient(180deg, rgba(96,165,250,0.05) 0%, transparent 35%, transparent 65%, rgba(124,58,237,0.06) 100%)' }}
              />
              <div className="mb-8 flex items-center justify-between">
                <Logo />
                <AnimatedButton
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text"
                >
                  <X size={18} />
                </AnimatedButton>
              </div>
              <SidebarLinks onNavigate={() => setMobileOpen(false)} groupId="mobile" />
              <SidebarFooter user={user} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
