import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/**
 * Measures how tall the deck may be for the whole section to fit one viewport:
 * the window height minus the section padding and every non-deck row (lede,
 * index, hint). Returned for the fan's scale.
 */
export function useDeckFit(
  surface: RefObject<HTMLElement | null>,
  deck: RefObject<HTMLDivElement | null>,
) {
  const [available, setAvailable] = useState<number | null>(null)

  useEffect(() => {
    const section = surface.current
    const deckElement = deck.current
    const wrap = section?.querySelector<HTMLElement>('.workshop-method')
    if (!section || !deckElement || !wrap) return
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const style = getComputedStyle(section)
        const chrome =
          parseFloat(style.paddingTop) +
          parseFloat(style.paddingBottom) +
          wrap.offsetHeight -
          deckElement.offsetHeight
        const next = Math.max(0, Math.floor(window.innerHeight - chrome))
        setAvailable((current) => (current === next ? current : next))
      })
    }
    measure()
    // The deck's own height follows from this value, so watch only the rows
    // around it; the deck changing size leaves the chrome unchanged.
    const observer = new ResizeObserver(measure)
    for (const element of section.querySelectorAll('.section-lede, .method-index, .method-deck-hint')) observer.observe(element)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [surface, deck])

  return available
}
