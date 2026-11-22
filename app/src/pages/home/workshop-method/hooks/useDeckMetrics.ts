import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

/** Tracks the deck width and the open sheet height for the fan layout. */
export function useDeckMetrics(
  deck: RefObject<HTMLDivElement | null>,
  active: number | null,
) {
  const [width, setWidth] = useState(900)
  const [sheetHeight, setSheetHeight] = useState(620)

  useEffect(() => {
    const element = deck.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [deck])

  useEffect(() => {
    const element = deck.current?.querySelector<HTMLLIElement>(
      '.method-sheet--open',
    )
    if (!element) return
    const observer = new ResizeObserver(() =>
      setSheetHeight(element.offsetHeight),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [deck, active])

  return { width, sheetHeight }
}
