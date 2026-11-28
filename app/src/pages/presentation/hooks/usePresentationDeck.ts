import { useCallback, useEffect, useRef } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { slides } from '../slides'
import { pointsOf } from '../playback/points'
import { keyName, plainKey, pressedOn, typingSelector } from '../keyTargets'
import { switchesOf } from '../playback/switches'
import type { PlaybackSwitches } from '../playback/switches'

export const TOTAL_SLIDES = slides.length

export const deckPoints = slides.map(pointsOf)

const SWIPE_DISTANCE = 48
const SWIPE_WINDOW_MS = 400

function clamp(value: number, max: number): number {
  if (!Number.isFinite(value)) return 1
  return Math.min(Math.max(1, Math.round(value)), max)
}

const pointsIn = (slide: number) => deckPoints[slide - 1].length

export function usePresentationDeck() {
  const { slide: requestedSlide, point: requestedPoint = 1, play, voice } = useSearch({ from: '/approach' })
  const initialSwitches = switchesOf({ play, voice })
  const navigate = useNavigate({ from: '/approach' })
  const slide = clamp(requestedSlide, TOTAL_SLIDES)
  const point = clamp(requestedPoint, pointsIn(slide))

  useEffect(() => {
    if (requestedSlide !== slide || requestedPoint !== point || play === undefined || voice === undefined) {
      void navigate({ search: (search) => ({ ...search, slide, point, ...switchesOf(search) }), replace: true })
    }
  }, [requestedSlide, requestedPoint, slide, point, play, voice, navigate])

  const goTo = useCallback(
    (target: number, targetPoint = 1) => {
      const nextSlide = clamp(target, TOTAL_SLIDES)
      const nextPoint = clamp(targetPoint, pointsIn(nextSlide))
      if (nextSlide === slide && nextPoint === point) return
      void navigate({ search: (search) => ({ ...search, slide: nextSlide, point: nextPoint }), replace: true })
    },
    [slide, point, navigate],
  )

  const rememberPlayback = useCallback(
    (now: PlaybackSwitches) => {
      if (play === now.play && voice === now.voice) return
      void navigate({ search: (search) => ({ ...search, ...now }), replace: true })
    },
    [play, voice, navigate],
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

  const onDeckKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!plainKey(event) || pressedOn(event, typingSelector)) return
      const key = keyName(event)
      const forward = key === 'ArrowRight' || key === 'PageDown' || key === 'n'
      const back = key === 'ArrowLeft' || key === 'PageUp' || key === 'p'
      if (forward || back) {
        event.preventDefault()
        if (event.shiftKey) goTo(slide + (forward ? 1 : -1))
        else if (forward) next()
        else prev()
      } else if (key === 'Home') {
        event.preventDefault()
        goTo(1)
      } else if (key === 'End') {
        event.preventDefault()
        goTo(TOTAL_SLIDES)
      }
    },
    [slide, next, prev, goTo],
  )

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
    initialSwitches,
    rememberPlayback,
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
