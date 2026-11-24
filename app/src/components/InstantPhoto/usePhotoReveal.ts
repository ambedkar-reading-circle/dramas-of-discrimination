import { useCallback, useEffect, useState } from 'react'
import type { PhotoReveal } from './types'

/** A press on the photo or on a trigger is not an outside press; each handles its own. */
const insideReveal = '.instant-photo, [data-photo-trigger]'

export function usePhotoReveal<TKey>(): PhotoReveal<TKey> {
  const [active, setActive] = useState<TKey | null>(null)

  const open = useCallback((key: TKey) => setActive(key), [])
  const close = useCallback(() => setActive(null), [])
  const isOpen = useCallback((key: TKey) => active === key, [active])
  const toggle = useCallback(
    (key: TKey) => setActive((current) => (current === key ? null : key)),
    [],
  )

  // While a photo shows, Escape or a press anywhere else puts it back.
  const showing = active !== null
  useEffect(() => {
    if (!showing) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      // Captured ahead of the diagram's own Escape, which would fold it away.
      event.stopPropagation()
      setActive(null)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(insideReveal)) return
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
