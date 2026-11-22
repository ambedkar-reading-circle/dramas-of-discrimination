import { useLayoutEffect } from 'react'

/**
 * Re-runs `align` once on mount, whenever any collected element resizes, and
 * when web fonts finish loading (`loadingdone` changes text metrics). Elements
 * are collected once per effect run; pass stable callbacks so the observation
 * set is not rebuilt on every render.
 */
export function useNotebookRuleAlign(
  getElements: () => Array<Element | null | undefined>,
  align: () => void,
): void {
  useLayoutEffect(() => {
    const elements = getElements().filter(
      (element): element is Element => element instanceof Element,
    )
    if (elements.length === 0) return
    align()
    const observer = new ResizeObserver(() => align())
    for (const element of elements) observer.observe(element)
    document.fonts.addEventListener('loadingdone', align)
    return () => {
      observer.disconnect()
      document.fonts.removeEventListener('loadingdone', align)
    }
  }, [getElements, align])
}
