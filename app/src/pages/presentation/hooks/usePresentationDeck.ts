import { useCallback, useEffect, useRef } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import { slides } from '../slides'

export const TOTAL_SLIDES = slides.length

/** Swipe must travel further than this many pixels to change the slide. */
const SWIPE_DISTANCE = 48
/** And complete within this window, mirroring usePointerTrace's stroke budget. */
const SWIPE_WINDOW_MS = 400

function clampSlide(value: number): number {
  if (!Number.isFinite(value)) return 1
  return Math.min(Math.max(1, Math.round(value)), TOTAL_SLIDES)
}

/**
 * Owns all deck state. The URL search param (`?slide=n`, 1-based) is the single
 * source of truth: every change is written back with `replace` so the history
 * stack never grows per slide, and out-of-range values are clamped on read.
 */
export function usePresentationDeck() {
  const { slide: requested } = useSearch({ from: '/approach' })
  const navigate = useNavigate({ from: '/approach' })
  const slide = clampSlide(requested)

  // Normalize a stale or out-of-range URL (deep links like ?slide=99) in place.
  useEffect(() => {
    if (requested !== slide) {
      void navigate({ search: { slide }, replace: true })
    }
  }, [requested, slide, navigate])

  const goTo = useCallback(
    (target: number) => {
      const next = clampSlide(target)
      if (next === slide) return
      void navigate({ search: { slide: next }, replace: true })
    },
    [slide, navigate],
  )

  const next = useCallback(() => goTo(slide + 1), [goTo, slide])
  const prev = useCallback(() => goTo(slide - 1), [goTo, slide])

  /** Bound on the deck container so keys work wherever focus sits inside it. */
  const onDeckKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      )
        return
      const atStart = slide <= 1
      const atEnd = slide >= TOTAL_SLIDES
      switch (event.key) {
        case 'ArrowRight':
        case 'PageDown':
        case 'n':
          if (!atEnd) {
            event.preventDefault()
            next()
          }
          break
        case 'ArrowLeft':
        case 'PageUp':
        case 'p':
          if (!atStart) {
            event.preventDefault()
            prev()
          }
          break
        case 'Home':
          event.preventDefault()
          goTo(1)
          break
        case 'End':
          event.preventDefault()
          goTo(TOTAL_SLIDES)
          break
      }
    },
    [slide, next, prev, goTo],
  )

  // Touch advance/retreat via pointer events, after usePointerTrace's pattern:
  // record the contact point, judge the gesture only on release.
  const swipeStart = useRef<{ x: number; y: number; time: number } | null>(null)
  const onStagePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'touch') return
      swipeStart.current = {
        x: event.clientX,
        y: event.clientY,
        time: event.timeStamp,
      }
    },
    [],
  )
  const onStagePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const start = swipeStart.current
      swipeStart.current = null
      if (!start || event.pointerType !== 'touch') return
      const dx = event.clientX - start.x
      const dy = event.clientY - start.y
      if (event.timeStamp - start.time > SWIPE_WINDOW_MS) return
      if (Math.abs(dx) <= SWIPE_DISTANCE || Math.abs(dx) <= Math.abs(dy)) return
      if (dx < 0) next()
      else prev()
    },
    [next, prev],
  )

  return {
    slide,
    total: TOTAL_SLIDES,
    goTo,
    next,
    prev,
    onDeckKeyDown,
    stageSwipeHandlers: {
      onPointerDown: onStagePointerDown,
      onPointerUp: onStagePointerUp,
    },
  }
}
