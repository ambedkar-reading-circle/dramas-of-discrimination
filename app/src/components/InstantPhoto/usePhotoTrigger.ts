import type { KeyboardEvent } from 'react'
import type { PhotoReveal } from './types'

export function usePhotoTrigger<TKey>(reveal: PhotoReveal<TKey>, key: TKey) {
  return {
    role: 'button',
    tabIndex: 0,
    'aria-pressed': reveal.isOpen(key),
    'data-photo-trigger': '',
    onClick: () => reveal.toggle(key),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      reveal.toggle(key)
    },
  } as const
}
