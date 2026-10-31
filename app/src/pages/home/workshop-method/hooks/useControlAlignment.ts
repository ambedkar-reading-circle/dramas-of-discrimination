import { useCallback } from 'react'
import type { RefObject } from 'react'
import { snapBaselineToRule, useNotebookRuleAlign } from '#/lib/notebook-align'

/**
 * Aligns the section controls as complete boxes so their labels retain even
 * padding. Relative offsets preserve document flow and the existing paper
 * rules; the offsets land in `--method-baseline-offset` per control.
 */
export function useControlAlignment(
  surface: RefObject<HTMLElement | null>,
  deck: RefObject<HTMLDivElement | null>,
) {
  const alignText = useCallback(() => {
    const element = surface.current
    if (!element) return
    const origin = element.getBoundingClientRect().top
    const row = parseFloat(getComputedStyle(element).lineHeight)
    for (const text of element.querySelectorAll<HTMLElement>(
      '.section-lede .eyebrow, .method-index-button .notebook-text, .method-deck-hint',
    )) {
      const target = text.closest<HTMLElement>('.method-index-button') ?? text
      const marker = document.createElement('span')
      marker.setAttribute('aria-hidden', 'true')
      marker.style.cssText =
        'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline'
      text.prepend(marker)
      const previousOffset = parseFloat(getComputedStyle(target).top) || 0
      const baseline =
        marker.getBoundingClientRect().top - origin - previousOffset
      marker.remove()
      const rule = snapBaselineToRule(baseline, row)
      target.style.setProperty(
        '--method-baseline-offset',
        `${rule - baseline}px`,
      )
    }
  }, [surface])

  const observeAlignment = useCallback(() => {
    const element = surface.current
    if (!element) return []
    // The section can keep its viewport minimum while the deck changes size.
    return [
      element,
      deck.current,
      ...element.querySelectorAll('.method-index, .method-deck-hint'),
    ]
  }, [surface, deck])

  useNotebookRuleAlign(observeAlignment, alignText)
}
