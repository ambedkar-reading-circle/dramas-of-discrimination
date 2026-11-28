import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionValue, useMotionValueEvent } from 'motion/react'
import type { MotionValue } from 'motion/react'
import type { BookDriver, TurnProgressEvent } from '../types/flipbook-types'
import {
  nextHead,
  restoredHead,
  shapeForPage,
  turnTarget,
} from '../engine/spreadPlan'

export function useManualFlipbook(
  progress: MotionValue<number>,
  desktop: boolean,
  driver: BookDriver,
) {
  const current = useRef(0)
  const desired = useRef(0)
  const frame = useRef(0)
  const paused = useRef(false)
  const [page, setPage] = useState(0)
  const [busy, setBusy] = useState(false)
  const shape = useMotionValue(0)
  const turnShape = useRef({ from: 0, to: 0 })

  const reconcile = useCallback(() => {
    if (
      paused.current ||
      !driver.canTurn() ||
      current.current === desired.current
    )
      return
    const target = turnTarget(current.current, desired.current, desktop)
    turnShape.current = {
      from: shape.get(),
      to: shapeForPage(target),
    }
    driver.turnTo(target)
  }, [desktop, driver, shape])

  const setPaused = useCallback(
    (value: boolean) => {
      paused.current = value
      if (!value) {
        cancelAnimationFrame(frame.current)
        frame.current = requestAnimationFrame(reconcile)
      }
    },
    [reconcile],
  )

  const followScroll = useCallback(
    (value: number) => {
      desired.current = nextHead(value, desired.current, desktop)
      reconcile()
    },
    [desktop, reconcile],
  )

  useMotionValueEvent(progress, 'change', followScroll)
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  function sync({ data: nextPage }: { data: number }) {
    current.current = nextPage
    setPage(nextPage)
    shape.set(shapeForPage(nextPage))
  }

  function turnProgress({ data: { progress: value } }: TurnProgressEvent) {
    const { from, to } = turnShape.current
    const amount =
      from === 1 ? Math.min(1, value * 2) : Math.max(0, value * 2 - 1)
    shape.set(from + (to - from) * amount)
  }

  function loaded({ data }: { data: { page: number } }) {
    sync({ data: data.page })
    setBusy(false)
    desired.current = restoredHead(progress.get(), desktop)
    if (desired.current !== data.page) driver.jumpTo(desired.current)
  }

  function changeState(reading: boolean) {
    setBusy(!reading)
    if (reading) {
      shape.set(shapeForPage(current.current))
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(reconcile)
    }
  }

  return {
    page,
    busy,
    shape,
    sync,
    loaded,
    changeState,
    turnProgress,
    setPaused,
  }
}
