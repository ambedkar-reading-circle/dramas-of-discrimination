export function observeResize(elements: ReadonlyArray<Element>, onResize: () => void): () => void {
  onResize()
  const observer = new ResizeObserver(() => onResize())
  for (const element of elements) observer.observe(element)
  return () => observer.disconnect()
}
