import { useCallback, useEffect, useRef, useState } from 'react'
import type { PhotoReveal } from './types'

/** Grace period between leaving a trigger and the photo closing, so the pointer can cross onto the photo. */
const closeDelay = 180

export function usePhotoReveal<TKey>(): PhotoReveal<TKey> {
  const [active, setActive] = useState<TKey | null>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const dragging = useRef(false)

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const keep = useCallback(() => window.clearTimeout(closeTimer.current), [])

  const open = useCallback((key: TKey) => {
    window.clearTimeout(closeTimer.current)
    setActive(key)
  }, [])

  const close = useCallback(() => {
    if (dragging.current) return
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setActive(null), closeDelay)
  }, [])

  const startDrag = useCallback(() => {
    dragging.current = true
    window.clearTimeout(closeTimer.current)
  }, [])

  const endDrag = useCallback(() => {
    dragging.current = false
  }, [])

  const isOpen = useCallback((key: TKey) => active === key, [active])

  const toggle = useCallback(
    (key: TKey, wasOpen: boolean) => (wasOpen ? close() : open(key)),
    [close, open],
  )

  return { active, open, isOpen, toggle, keep, close, startDrag, endDrag }
}
