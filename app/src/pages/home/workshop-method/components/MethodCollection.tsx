import { useRef, useState } from 'react'
import '../WorkshopMethod.css'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { workshopActivities } from '../content/workshopActivities'
import { spring } from '../content/deckChoreography'
import { useDeckLayout } from '../hooks/useDeckLayout'
import type { DeckFitTarget } from '../hooks/useDeckFit'
import { ActivitySheet } from './ActivitySheet'
import { ActivityDialog } from './ActivityDialog'
import { MethodIndex } from './MethodIndex'

type MethodCollectionProps = {
  /** The section to fit on one screen; left out, the deck keeps its size. */
  fitTo?: DeckFitTarget
  hint?: boolean
}

/** The fanned deck of activities, its index, and the sheet each one opens. */
export function MethodCollection({ fitTo, hint = true }: MethodCollectionProps) {
  const [active, setActive] = useState<number | null>(null)
  const deck = useRef<HTMLDivElement>(null)
  const reduceMotion = usePrefersReducedMotion()
  const geometry = useDeckLayout(deck, fitTo)
  const transition = reduceMotion ? { duration: 0 } : spring

  return (
    <div className="method-collection activity-surface" data-notebook-independent>
      <div className="method-deck" ref={deck} style={{ height: geometry.height }}>
        <ol className="method-sheets" aria-label="Workshop activities">
          {workshopActivities.map((activity, index) => (
            <ActivitySheet key={activity.name} activity={activity} index={index} total={workshopActivities.length} selected={active === index} geometry={geometry} reduceMotion={reduceMotion} transition={transition} onTrigger={setActive} />
          ))}
        </ol>
      </div>
      <MethodIndex activities={workshopActivities} active={active} onSelect={setActive} hint={hint} />
      <ActivityDialog activities={workshopActivities} active={active} onSelect={setActive} onClose={() => setActive(null)} />
    </div>
  )
}
