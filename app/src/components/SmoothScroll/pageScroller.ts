import type Lenis from 'lenis'

let active: Lenis | null = null

export function registerPageScroller(lenis: Lenis | null) {
  active = lenis
}

export function scrollPageTo(y: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight
  const top = Math.max(0, Math.min(Math.round(y), max))
  if (active) active.scrollTo(top)
  else window.scrollTo({ top, behavior: 'instant' })
}
