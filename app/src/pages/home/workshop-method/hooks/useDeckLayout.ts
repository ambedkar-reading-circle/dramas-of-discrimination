import type { RefObject } from 'react'
import { useControlAlignment } from './useControlAlignment'
import { useDeckFit } from './useDeckFit'
import type { DeckFitTarget } from './useDeckFit'
import { useDeckMetrics } from './useDeckMetrics'

/**
 * Measures the deck and the section around it and returns the fan's layout.
 * With a section to fit, the deck shrinks to keep it on one screen and the
 * controls snap to its paper rules; embedded elsewhere, it keeps its size.
 */
export function useDeckLayout(
  deck: RefObject<HTMLDivElement | null>,
  fitTo: DeckFitTarget | undefined,
) {
  const width = useDeckMetrics(deck)
  const available = useDeckFit(fitTo, deck)
  useControlAlignment(fitTo?.surface, deck)
  return deckGeometry(width, available)
}

export interface DeckGeometry {
  small: boolean
  cardWidth: number
  /** Horizontal step between neighbouring cards in the fan. */
  spread: number
  /** Closed-fan scale that fits the deck to the viewport. */
  fit: number
  /** The deck's height at that scale. */
  height: number
}

/**
 * Lays out the fan for a deck `width` wide, shrunk to fit `available` pixels
 * of height (null until measured, or when nothing constrains it). An open
 * sheet is a modal over the viewport, so the fan never changes size for it.
 */
export function deckGeometry(
  width: number,
  available: number | null,
): DeckGeometry {
  const small = width < 600
  const cardWidth = small ? Math.min(230, width - 40) : 260
  const spread = Math.min(142, Math.max(20, (width - cardWidth - 60) / 4))
  const closedHeight = small ? 430 : 510
  const fit =
    available === null
      ? 1
      : Math.min(1, Math.max(0.55, available / closedHeight))
  return {
    small,
    cardWidth,
    spread,
    fit,
    height: Math.round(closedHeight * fit),
  }
}
