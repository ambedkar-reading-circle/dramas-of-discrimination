import { createContext, use, useEffect, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { useLatest } from '#/lib/use-latest'
import type { CueState, CueTarget, CueTargets } from './cues'
import type { Point, SlidePoints } from './points'
import { usePlayback } from './playback'

/** The deck at one slide: where it stands among the points, the cues in effect there, and how many times they have been applied. */
type Scope = SlidePoints &
  Readonly<{
    cues: CueState
    cuesApplied: number
  }>

const ScopeContext = createContext<Scope | null>(null)

type Options<TValue> = Readonly<{
  /** What the target shows at a point no cue has set it yet. */
  rest?: TValue
  /**
   * What the slide shows now. Passing it lets a change made by hand move the
   * deck: to the point whose cues set this value, nearest the current one.
   */
  value?: TValue
}>

/** Cue values are plain data, so two with the same JSON are the same value. */
const deepEqual = (a: unknown, b: unknown) => a === b || JSON.stringify(a) === JSON.stringify(b)

/**
 * The point a hand change belongs to: the start of the nearest run of points
 * whose cues give the target this value, or null when no point does.
 */
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

/**
 * Links a slide's target to the deck's points, both ways.
 *
 * Each time the deck moves to a point (or play is pressed), `set` is called
 * with the value the point's cues give the target, or with `rest` when none
 * has set it yet. Without a `rest`, a point no cue has reached leaves the
 * target as the Room last left it.
 *
 * With `value`, a change made by hand inside the slide moves the deck to the
 * point that shows it, so the slide number and caption follow the click. A
 * value no point sets, or a return to `rest` (closing a photo), stays a
 * change by hand, until the deck next moves.
 */
export function useCueTarget<TTarget extends CueTarget>(id: TTarget, set: (value: CueTargets[TTarget]) => void, options: Options<CueTargets[TTarget]> = {}) {
  const scope = use(ScopeContext)
  const latestSet = useLatest(set)
  const hasRest = 'rest' in options
  const cued = scope !== null && id in scope.cues
  const target = cued ? (scope.cues[id] as CueTargets[TTarget]) : options.rest
  const applies = cued || hasRest
  const cuesApplied = scope?.cuesApplied ?? 0

  // What the cues last asked the slide to show; the value on arrival counts as asked.
  const lastCued = useRef<unknown>(options.value)
  useEffect(() => {
    if (cuesApplied === 0 || !applies) return
    lastCued.current = target
    latestSet.current(target as CueTargets[TTarget])
  }, [cuesApplied, applies, target])

  const tracked = 'value' in options
  const value = options.value
  const latestScope = useLatest(scope)
  useEffect(() => {
    const at = latestScope.current
    if (!tracked || !at || deepEqual(value, lastCued.current)) return
    lastCued.current = value
    if (hasRest && deepEqual(value, options.rest)) return
    const point = pointFor(at.points, at.point, id, value)
    if (point !== null && point !== at.point) at.goToPoint(point)
    // Only a change in what the slide shows is a hand change; the rest of the options are read as they stand.
  }, [tracked, value])
}

/** The cues of one slide: the current point's while the deck is on it, none while it leaves. */
export function CueScope({ slideId, children }: { slideId: string; children: ReactNode }) {
  const playback = usePlayback()
  const active = playback !== null && playback.slideId === slideId
  const cues = active ? playback.current.cues : null
  const cuesApplied = active ? playback.cuesApplied : 0
  const points = active ? playback.points : null
  const point = active ? playback.point : 0
  const goToPoint = playback?.goToPoint
  const scope = useMemo(() => (cues === null || points === null || !goToPoint ? null : { cues, cuesApplied, points, point, goToPoint }), [cues, cuesApplied, points, point, goToPoint])
  return <ScopeContext value={scope}>{children}</ScopeContext>
}
