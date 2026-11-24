import type Lenis from 'lenis'

// SmoothScroll owns the Lenis instance; other features scroll through it so a
// programmatic scroll never fights Lenis's own animated position.
let active: Lenis | null = null

export function registerPageScroller(lenis: Lenis | null) {
  active = lenis
}

/** Scroll the window to an absolute Y, smoothly unless motion is reduced. */
export function scrollPageTo(y: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const top = Math.max(0, Math.min(Math.round(y), max))
  if (active) active.scrollTo(top)
  else window.scrollTo({ top, behavior: 'instant' })
}
