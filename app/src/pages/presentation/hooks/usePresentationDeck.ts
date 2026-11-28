import { useCallback, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { slides } from '../slides'
import { pointsOf } from '../playback/points'
import { switchesOf } from '../playback/switches'
import type { PlaybackSwitches } from '../playback/switches'
import { useDeckKeys } from './useDeckKeys'
import { useSwipe } from './useSwipe'

export const TOTAL_SLIDES = slides.length

export const deckPoints = slides.map(pointsOf)

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

  const onDeckKeyDown = useDeckKeys({ slide, total: TOTAL_SLIDES, next, prev, goTo })
  const stageSwipeHandlers = useSwipe(next, prev)

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
    stageSwipeHandlers,
  }
}

export type DeckPosition = ReturnType<typeof usePresentationDeck>
