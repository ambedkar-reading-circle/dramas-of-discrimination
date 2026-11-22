import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

const marginWords = ['liberty', 'equality', 'fraternity'] as const
type Registration = { element: HTMLDivElement; word: HTMLElement | null }

function createMarginController() {
  const layers = new Set<Registration>()
  let active = false
  let x = 0
  let y = 0
  let lastY: number | undefined
  let word: string = marginWords[0]
  let frame = 0

  function paint({ element, word: label }: Registration) {
    element.style.setProperty('--margin-x', String(x))
    element.style.setProperty('--margin-y', String(y))
    element.toggleAttribute('data-margin-guides', active)
    // This empty span belongs to the controller, not React's render state.
    if (label && label.textContent !== `...${word}`) label.textContent = `...${word}`
  }

  function register(element: HTMLDivElement) {
    const layer = { element, word: element.querySelector<HTMLElement>('[data-margin-word]') }
    layers.add(layer)
    paint(layer)
    return () => {
      layers.delete(layer)
    }
  }

  function hide() {
    active = false
    cancelAnimationFrame(frame)
    frame = 0
    for (const { element } of layers) element.removeAttribute('data-margin-guides')
  }

  function track(event: PointerEvent) {
    x = event.clientX
    y = event.clientY
    active = true
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      if (y !== lastY) {
        word = marginWords[Math.floor(Math.random() * marginWords.length)] ?? marginWords[0]
        lastY = y
      }
      for (const layer of layers) paint(layer)
    })
  }

  function listen() {
    window.addEventListener('pointermove', track, { passive: true })
    window.addEventListener('pointerdown', track)
    document.documentElement.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    return () => {
      window.removeEventListener('pointermove', track)
      window.removeEventListener('pointerdown', track)
      document.documentElement.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      hide()
    }
  }

  return { register, listen }
}

const MarginContext = createContext<ReturnType<typeof createMarginController>['register'] | null>(null)

export function NotebookProvider({ children }: { children: ReactNode }) {
  const [controller] = useState(createMarginController)
  useEffect(controller.listen, [controller])
  return <MarginContext.Provider value={controller.register}>{children}</MarginContext.Provider>
}

export function NotebookDecoration() {
  const register = useContext(MarginContext)
  if (!register) throw new Error('Notebook surfaces require a NotebookProvider')
  return (
    <div ref={register} className="notebook-decoration" aria-hidden="true">
      <div className="notebook-margin-vertical" />
      <div className="notebook-margin-horizontal" />
      <div className="margin-guide-labels uppercase">
        <span className="px-1">Move the margins for...</span>
        <span className="px-1" data-margin-word />
      </div>
    </div>
  )
}
