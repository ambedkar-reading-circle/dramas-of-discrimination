import { useEffect, useMemo, useRef } from 'react'
import type { Point, PointerTrace, PointerTraceListener } from './types.ts'

const CONTACT_POINTER_TYPES = new Set(['pen'])
const HOVER_POINTER_TYPES = new Set(['mouse', ''])
const STROKE_GAP = 160

function toPoint(event: PointerEvent): Point {
  return { x: event.pageX, y: event.pageY, time: event.timeStamp }
}

function isHoverPointer(event: PointerEvent): boolean {
  return HOVER_POINTER_TYPES.has(event.pointerType)
}

export function usePointerTrace(): PointerTrace {
  const listenersRef = useRef<Set<PointerTraceListener> | null>(null)
  const activePointerRef = useRef<number | null>(null)
  const contactStrokeRef = useRef(false)
  const lastPointRef = useRef<Point | null>(null)

  const trace = useMemo<PointerTrace>(
    () => ({
      subscribe(listener) {
        let listeners = listenersRef.current
        if (!listeners) {
          listeners = new Set()
          listenersRef.current = listeners
        }
        listeners.add(listener)
        return () => {
          listeners.delete(listener)
        }
      },
    }),
    [],
  )

  useEffect(() => {
    function emit(dispatch: (listener: PointerTraceListener) => void) {
      const listeners = listenersRef.current
      if (!listeners) return
      for (const listener of listeners) dispatch(listener)
    }

    function finish(event: PointerEvent) {
      if (activePointerRef.current !== event.pointerId) return
      activePointerRef.current = null
      contactStrokeRef.current = false
      lastPointRef.current = null
      emit((listener) => listener.end())
    }

    function onPointerDown(event: PointerEvent) {
      if (!CONTACT_POINTER_TYPES.has(event.pointerType)) return
      if (event.button !== 0) return
      const point = toPoint(event)
      if (activePointerRef.current !== null) emit((listener) => listener.end())
      contactStrokeRef.current = true
      activePointerRef.current = event.pointerId
      lastPointRef.current = point
      emit((listener) => listener.begin(point))
    }

    function onPointerMove(event: PointerEvent) {
      const hovering = isHoverPointer(event)
      if (!hovering && !CONTACT_POINTER_TYPES.has(event.pointerType)) return
      if (!hovering && activePointerRef.current !== event.pointerId) return
      if (hovering && contactStrokeRef.current) return
      const point = toPoint(event)
      const last = lastPointRef.current
      const jumped =
        last === null ||
        Math.hypot(point.x - last.x, point.y - last.y) > STROKE_GAP
      if (
        hovering &&
        (activePointerRef.current !== event.pointerId || jumped)
      ) {
        if (activePointerRef.current !== null)
          emit((listener) => listener.end())
        activePointerRef.current = event.pointerId
        emit((listener) => listener.begin(point))
      }
      const samples =
        typeof event.getCoalescedEvents === 'function'
          ? event.getCoalescedEvents()
          : []
      const points = (samples.length > 0 ? samples : [event]).map(toPoint)
      emit((listener) => listener.extend(points))
      lastPointRef.current = point
    }

    function onPointerUp(event: PointerEvent) {
      if (isHoverPointer(event)) return
      finish(event)
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', finish)
    document.documentElement.addEventListener('pointerleave', finish)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', finish)
      document.documentElement.removeEventListener('pointerleave', finish)
    }
  }, [])

  return trace
}
