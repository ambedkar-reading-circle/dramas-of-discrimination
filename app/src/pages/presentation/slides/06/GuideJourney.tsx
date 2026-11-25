import { motion } from 'motion/react'
import type { Transition } from 'motion/react'
import { twoDigit } from '#/lib/format'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { workshopActivities } from '#/pages/home/workshop-method'

type StepState = 'done' | 'now' | 'next'

export function stateOf(index: number, current: number): StepState {
  return index < current ? 'done' : index === current ? 'now' : 'next'
}

/** How full an act's track is: done and upcoming acts are settled, the current one fills by step. */
const settledFill: Partial<Record<StepState, number>> = { done: 1, next: 0 }

export const guideSpring: Transition = { type: 'spring', stiffness: 260, damping: 30 }

/** The given transition, or an instant one when the viewer prefers reduced motion. */
export function motionUnlessReduced(reducedMotion: boolean, transition: Transition = guideSpring): Transition {
  return reducedMotion ? { duration: 0 } : transition
}

type GuideJourneyProps = {
  act: number
  step: number
  /** Leave out for a journey that only shows where the room is. */
  onSelect?: (act: number) => void
}

/** The whole workshop across the top of the guide: five acts, each as wide as its share of the day. */
export function GuideJourney({ act, step, onSelect }: GuideJourneyProps) {
  const reducedMotion = usePrefersReducedMotion()
  return (
    <nav className="fac-journey" aria-label="Workshop journey">
      <ol>
        {workshopActivities.map((item, index) => {
          const state = stateOf(index, act)
          const fill = settledFill[state] ?? (step + 0.5) / item.steps.length
          return (
            <li key={item.name} data-state={state} style={{ flexGrow: item.duration }}>
              <button type="button" onClick={onSelect && (() => onSelect(index))} aria-current={state === 'now' ? 'step' : undefined}>
                <span className="fac-journey-num">{twoDigit(index + 1)}</span>
                <span className="fac-journey-name">{item.name}</span>
                <span className="fac-journey-time">{item.duration}′</span>
              </button>
              <span className="fac-journey-track" aria-hidden="true">
                {item.steps.map((_, stepIndex) => (
                  <span key={stepIndex} className="fac-journey-notch" style={{ left: `${(stepIndex / item.steps.length) * 100}%` }} />
                ))}
                <motion.span className="fac-journey-fill" initial={false} animate={{ width: `${fill * 100}%` }} transition={motionUnlessReduced(reducedMotion)} />
                {state === 'now' && <motion.span layoutId="fac-here" className="fac-journey-here" style={{ left: `${fill * 100}%` }} transition={motionUnlessReduced(reducedMotion)} />}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
