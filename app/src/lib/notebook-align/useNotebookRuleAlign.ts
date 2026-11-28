import { useLayoutEffect } from 'react'
import { observeResize } from '#/lib/observe-resize'

export function useNotebookRuleAlign(
  getElements: () => Array<Element | null | undefined>,
  align: () => void,
): void {
  useLayoutEffect(() => {
    const elements = getElements().filter(
      (element): element is Element => element instanceof Element,
    )
    if (elements.length === 0) return
    const stop = observeResize(elements, align)
    document.fonts.addEventListener('loadingdone', align)
    return () => {
      stop()
      document.fonts.removeEventListener('loadingdone', align)
    }
  }, [getElements, align])
}
