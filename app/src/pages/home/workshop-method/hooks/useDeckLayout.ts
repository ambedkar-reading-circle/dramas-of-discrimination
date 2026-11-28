import type { RefObject } from 'react'
import { useControlAlignment } from './useControlAlignment'
import { useDeckFit } from './useDeckFit'
import type { DeckFitTarget } from './useDeckFit'
import { useDeckMetrics } from './useDeckMetrics'

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
  spread: number
  fit: number
  height: number
}

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
