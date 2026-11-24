import { useCallback, useEffect, useState } from 'react'
import { insideReveal } from './revealAttributes'
import type { Reveal } from './types'

export function useReveal<TKey>(): Reveal<TKey> {
  const [active, setActive] = useState<TKey | null>(null)

  const open = useCallback((key: TKey) => setActive(key), [])
  const close = useCallback(() => setActive(null), [])
  const isOpen = useCallback((key: TKey) => active === key, [active])
  const toggle = useCallback(
    (key: TKey) => setActive((current) => (current === key ? null : key)),
    [],
  )

  const showing = active !== null
  useEffect(() => {
    if (!showing) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setActive(null)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(insideReveal))
        return
      setActive(null)
    }
    window.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [showing])

  return { active, open, isOpen, toggle, close }
}
