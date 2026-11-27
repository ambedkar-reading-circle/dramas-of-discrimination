import { useCallback, useEffect, useState } from 'react'

/**
 * Whether the element `target` finds is fullscreen, and a toggle for it.
 * `target` is read on each use, so it can find an element rendered after this
 * hook first runs.
 */
export function useFullscreen(target: () => HTMLElement | null) {
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement !== null && document.fullscreenElement === target())
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [target])

  const toggle = useCallback(() => {
    const element = target()
    if (!element) return
    if (document.fullscreenElement === element) void document.exitFullscreen()
    else void element.requestFullscreen().catch(() => {})
  }, [target])

  return { fullscreen, toggle }
}
