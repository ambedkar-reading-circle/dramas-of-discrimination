/**
 * Calls `onResize` now and again each time any of the elements changes size.
 * Returns the cleanup, for the effect that called it.
 */
export function observeResize(elements: ReadonlyArray<Element>, onResize: () => void): () => void {
  onResize()
  const observer = new ResizeObserver(() => onResize())
  for (const element of elements) observer.observe(element)
  return () => observer.disconnect()
}
