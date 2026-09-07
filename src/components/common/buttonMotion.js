// Shared hover/tap spring physics + the diagonal "light catching glass"
// sweep — Button.jsx's signature micro-interaction, extracted so any other
// clickable control (tabs, toggles, icon buttons, list items) can carry the
// exact same feel via AnimatedButton.jsx instead of only the primary CTA
// buttons getting it.
export const BUTTON_MOTION_VARIANTS = {
  rest:  { y: 0,  scale: 1,    transition: { type: 'spring', stiffness: 260, damping: 26, mass: 0.7 } },
  hover: { y: -3, scale: 1.02, transition: { type: 'spring', stiffness: 260, damping: 26, mass: 0.7 } },
  tap:   { y: 0,  scale: 0.96, transition: { type: 'spring', stiffness: 420, damping: 24, mass: 0.5 } },
}

export const SWEEP_VARIANTS = {
  rest:  { x: '-150%', opacity: 0 },
  hover: { x: '350%',  opacity: 1 },
}

export const SWEEP_TRANSITION = { duration: 0.6, ease: 'easeInOut' }
