import { useLayoutEffect } from 'react'

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
