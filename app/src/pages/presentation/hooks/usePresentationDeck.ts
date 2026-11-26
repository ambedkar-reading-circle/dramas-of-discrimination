import { useCallback, useEffect, useRef } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import { slides } from '../slides'
import { pointsOf } from '../playback/points'

export const TOTAL_SLIDES = slides.length

/** Every slide's points, worked out once: the notes do not change while the deck runs. */
export const deckPoints = slides.map(pointsOf)

/** Swipe must travel further than this many pixels to change the point. */
const SWIPE_DISTANCE = 48
/** And complete within this window, mirroring usePointerTrace's stroke budget. */
const SWIPE_WINDOW_MS = 400

function clamp(value: number, max: number): number {
  if (!Number.isFinite(value)) return 1
  return Math.min(Math.max(1, Math.round(value)), max)
}

const pointsIn = (slide: number) => deckPoints[slide - 1].length

/**
 * Owns the deck's position: the slide, and the point of its speaker notes
 * (`?slide=4&point=3`, both 1-based, shown as 4.3). The URL is the single
 * source of truth: every change is written back with `replace` so the
 * history stack never grows, and out-of-range values are clamped on read.
 * Moving keeps the other params, so `?play=1` survives it.
 *
 * The arrows, their keys and a swipe step one point, crossing into the next
 * slide's first point or the previous slide's last. Shift with an arrow,
 * Home and End, and the slide strip jump whole slides, to their first point.
 */
export function usePresentationDeck() {
  const { slide: requestedSlide, point: requestedPoint = 1 } = useSearch({ from: '/approach' })
  const navigate = useNavigate({ from: '/approach' })
  const slide = clamp(requestedSlide, TOTAL_SLIDES)
  const point = clamp(requestedPoint, pointsIn(slide))

  // Normalize a stale or out-of-range URL (deep links like ?slide=99) in place.
  useEffect(() => {
    if (requestedSlide !== slide || requestedPoint !== point) {
      void navigate({ search: (search) => ({ ...search, slide, point }), replace: true })
    }
  }, [requestedSlide, requestedPoint, slide, point, navigate])

  const goTo = useCallback(
    (target: number, targetPoint = 1) => {
      const nextSlide = clamp(target, TOTAL_SLIDES)
      const nextPoint = clamp(targetPoint, pointsIn(nextSlide))
      if (nextSlide === slide && nextPoint === point) return
      void navigate({ search: (search) => ({ ...search, slide: nextSlide, point: nextPoint }), replace: true })
    },
    [slide, point, navigate],
  )

  const atStart = slide === 1 && point === 1
  const atEnd = slide === TOTAL_SLIDES && point === pointsIn(slide)

  const next = useCallback(() => {
    if (point < pointsIn(slide)) goTo(slide, point + 1)
    else if (slide < TOTAL_SLIDES) goTo(slide + 1)
  }, [goTo, slide, point])
  const prev = useCallback(() => {
    if (point > 1) goTo(slide, point - 1)
    else if (slide > 1) goTo(slide - 1, pointsIn(slide - 1))
  }, [goTo, slide, point])

  /** Bound on the deck container so keys work wherever focus sits inside it. */
  const onDeckKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
      const forward = event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === 'n'
      const back = event.key === 'ArrowLeft' || event.key === 'PageUp' || event.key === 'p'
      if (forward || back) {
        event.preventDefault()
        if (event.shiftKey) goTo(slide + (forward ? 1 : -1))
        else if (forward) next()
        else prev()
      } else if (event.key === 'Home') {
        event.preventDefault()
        goTo(1)
      } else if (event.key === 'End') {
        event.preventDefault()
        goTo(TOTAL_SLIDES)
      }
    },
    [slide, next, prev, goTo],
  )

  // Touch advance/retreat via pointer events, after usePointerTrace's pattern:
  // record the contact point, judge the gesture only on release.
  const swipeStart = useRef<{ x: number; y: number; time: number } | null>(null)
  const onStagePointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'touch') return
    swipeStart.current = { x: event.clientX, y: event.clientY, time: event.timeStamp }
  }, [])
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
    point,
    total: TOTAL_SLIDES,
    atStart,
    atEnd,
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

export type DeckPosition = ReturnType<typeof usePresentationDeck>
