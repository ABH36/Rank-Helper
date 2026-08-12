import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import './index.css'
import App from './App.jsx'

// ─── Lenis smooth inertia scroll ─────────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.25,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // expo ease-out
  smooth: true,
  smoothTouch: false,   // keep native on mobile to avoid jank
})

function rafLoop(time) {
  lenis.raf(time)
  requestAnimationFrame(rafLoop)
}
requestAnimationFrame(rafLoop)
// ─────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
