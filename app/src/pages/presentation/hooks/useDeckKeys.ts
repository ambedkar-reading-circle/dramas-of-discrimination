import { useCallback } from 'react'
import { keyName, plainKey, pressedOn, typingSelector } from '../keyTargets'

type DeckMoves = Readonly<{
  slide: number
  total: number
  next: () => void
  prev: () => void
  goTo: (slide: number, point?: number) => void
}>

export function useDeckKeys({ slide, total, next, prev, goTo }: DeckMoves) {
  return useCallback(
    (event: KeyboardEvent) => {
      if (!plainKey(event) || pressedOn(event, typingSelector)) return
      const key = keyName(event)
      const forward = key === 'ArrowRight' || key === 'PageDown' || key === 'n'
      const back = key === 'ArrowLeft' || key === 'PageUp' || key === 'p'
      if (forward || back) {
        event.preventDefault()
        if (event.shiftKey) goTo(slide + (forward ? 1 : -1))
        else if (forward) next()
        else prev()
      } else if (key === 'Home') {
        event.preventDefault()
        goTo(1)
      } else if (key === 'End') {
        event.preventDefault()
        goTo(total)
      }
    },
    [slide, total, next, prev, goTo],
  )
}
