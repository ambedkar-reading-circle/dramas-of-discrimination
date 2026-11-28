import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import { observeResize } from '#/lib/observe-resize'

export interface DeckFitTarget {
  surface: RefObject<HTMLElement | null>
  content: RefObject<HTMLElement | null>
}

export function useDeckFit(
  fitTo: DeckFitTarget | undefined,
  deck: RefObject<HTMLDivElement | null>,
) {
  const [available, setAvailable] = useState<number | null>(null)
  const surface = fitTo?.surface
  const content = fitTo?.content

  useEffect(() => {
    const section = surface?.current
    const wrap = content?.current
    const deckElement = deck.current
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
    const stop = observeResize([...section.querySelectorAll('.section-lede, .method-index, .method-deck-hint')], measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      stop()
      window.removeEventListener('resize', measure)
    }
  }, [surface, content, deck])

  return available
}
