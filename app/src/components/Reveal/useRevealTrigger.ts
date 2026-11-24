import type { KeyboardEvent } from 'react'
import { revealTrigger } from './revealAttributes'
import type { Reveal } from './types'

export function useRevealTrigger<TKey>(reveal: Reveal<TKey>, key: TKey) {
  return {
    ...revealTrigger,
    role: 'button',
    tabIndex: 0,
    'aria-pressed': reveal.isOpen(key),
    onClick: () => reveal.toggle(key),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      reveal.toggle(key)
    },
  } as const
}
