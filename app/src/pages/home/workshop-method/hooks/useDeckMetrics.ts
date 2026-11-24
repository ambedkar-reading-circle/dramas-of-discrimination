import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/** Tracks the deck width for the fan layout. */
export function useDeckMetrics(deck: RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(900)

  useEffect(() => {
    const element = deck.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [deck])

  return width
}
