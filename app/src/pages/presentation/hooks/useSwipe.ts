import { useCallback, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

const SWIPE_DISTANCE = 48
const SWIPE_WINDOW_MS = 400

type SwipeStart = Readonly<{ x: number; y: number; time: number }>

export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const start = useRef<SwipeStart | null>(null)
  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'touch') return
    start.current = { x: event.clientX, y: event.clientY, time: event.timeStamp }
  }, [])
  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const from = start.current
      start.current = null
      if (!from || event.pointerType !== 'touch') return
      const dx = event.clientX - from.x
      const dy = event.clientY - from.y
      if (event.timeStamp - from.time > SWIPE_WINDOW_MS) return
      if (Math.abs(dx) <= SWIPE_DISTANCE || Math.abs(dx) <= Math.abs(dy)) return
      if (dx < 0) onSwipeLeft()
      else onSwipeRight()
    },
    [onSwipeLeft, onSwipeRight],
  )
  return { onPointerDown, onPointerUp }
}
