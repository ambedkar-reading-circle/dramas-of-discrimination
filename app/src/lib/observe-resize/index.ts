export function observeResize(elements: ReadonlyArray<Element>, onResize: () => void): () => void {
  onResize()
  const observer = new ResizeObserver(() => onResize())
  for (const element of elements) observer.observe(element)
  return () => observer.disconnect()
}

export function bindHeightVariable(element: HTMLElement, target: HTMLElement, property: string): () => void {
  const stop = observeResize([element], () => target.style.setProperty(property, `${element.getBoundingClientRect().height}px`))
  return () => {
    stop()
    target.style.removeProperty(property)
  }
}
