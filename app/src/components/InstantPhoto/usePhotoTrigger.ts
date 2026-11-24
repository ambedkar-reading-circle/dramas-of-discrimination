import { useRef } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { isMousePointer } from './pointer'
import type { PhotoReveal } from './types'

interface Press {
  mouse: boolean
  wasOpen: boolean
}

const unknownPress: Press = { mouse: true, wasOpen: false }

export function usePhotoTrigger<TKey>(reveal: PhotoReveal<TKey>, key: TKey) {
  const press = useRef<Press | null>(null)
  const isOpen = reveal.isOpen(key)

  return {
    role: 'button',
    tabIndex: 0,
    'aria-pressed': isOpen,
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      press.current = { mouse: isMousePointer(event), wasOpen: isOpen }
    },
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (isMousePointer(event)) reveal.open(key)
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      if (isMousePointer(event)) reveal.close()
    },
    onClick: () => {
      const { mouse, wasOpen } = press.current ?? unknownPress
      press.current = null
      if (mouse) reveal.open(key)
      else reveal.toggle(key, wasOpen)
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      reveal.toggle(key, isOpen)
    },
    onFocus: () => reveal.open(key),
    onBlur: reveal.close,
  } as const
}
