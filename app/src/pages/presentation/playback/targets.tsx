import { createContext, use, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { Reveal } from '#/components/Reveal'
import type { SlideId } from '../types'
import { useLatest } from '#/lib/use-latest'
import type { CueTarget, CueTargets } from './cues'
import type { Point, SlideCues } from './points'
import { usePlayback } from './playback'

const ScopeContext = createContext<SlideCues | null>(null)

type Options<TValue> = Readonly<{
  rest?: TValue
  value?: TValue
  followRest?: boolean
}>

const deepEqual = (a: unknown, b: unknown) => a === b || JSON.stringify(a) === JSON.stringify(b)

function pointFor(points: ReadonlyArray<Point>, current: number, id: CueTarget, value: unknown): number | null {
  const holds = (index: number) => id in points[index].cues && deepEqual(points[index].cues[id], value)
  if (holds(current - 1)) return current
  let best: number | null = null
  points.forEach((_, index) => {
    if (!holds(index) || (index > 0 && holds(index - 1))) return
    if (best === null || Math.abs(index + 1 - current) < Math.abs(best - current)) best = index + 1
  })
  return best
}

export function useCueTarget<TTarget extends CueTarget>(id: TTarget, set: (value: CueTargets[TTarget]) => void, options: Options<CueTargets[TTarget]> = {}) {
  const scope = use(ScopeContext)
  const latestSet = useLatest(set)
  const hasRest = 'rest' in options
  const cued = scope !== null && id in scope.cues
  const target = cued ? (scope.cues[id] as CueTargets[TTarget]) : options.rest
  const applies = cued || hasRest
  const cuesApplied = scope?.cuesApplied ?? 0

  const lastCued = useRef<unknown>(options.value)
  useEffect(() => {
    if (cuesApplied === 0 || !applies) return
    lastCued.current = target
    latestSet.current(target as CueTargets[TTarget])
  }, [cuesApplied, applies, target])

  const tracked = 'value' in options
  const value = options.value
  const latestScope = useLatest(scope)
  const lastSeen = useRef<unknown>(options.value)
  useEffect(() => {
    const at = latestScope.current
    if (!tracked || deepEqual(value, lastSeen.current)) return
    lastSeen.current = value
    if (!at || deepEqual(value, lastCued.current)) return
    lastCued.current = value
    if (hasRest && options.followRest !== true && deepEqual(value, options.rest)) return
    const point = pointFor(at.points, at.point, id, value)
    if (point !== null && point !== at.point) at.goToPoint(point)
  }, [tracked, value])
}

type RevealTarget = { [K in CueTarget]: null extends CueTargets[K] ? K : never }[CueTarget]

export function useRevealCue<TTarget extends RevealTarget>(id: TTarget, reveal: Reveal<NonNullable<CueTargets[TTarget]>>) {
  type Value = CueTargets[TTarget]
  useCueTarget(id, (key: Value) => (key === null ? reveal.close() : reveal.open(key as NonNullable<Value>)), { rest: null as Value, value: reveal.active as Value })
}

export function CueScope({ slideId, children }: { slideId: SlideId; children: ReactNode }) {
  const slideCues = usePlayback()?.slideCues
  const scope = slideCues?.slideId === slideId ? slideCues : null
  return <ScopeContext value={scope}>{children}</ScopeContext>
}
