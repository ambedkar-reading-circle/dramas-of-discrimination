import { useRef, useState } from 'react'
import './WorkshopMethod.css'
import NotebookSurface from '#/components/NotebookSurface'
import { useMediaQuery } from '#/lib/use-media-query'
import { workshopActivities } from './content/workshopActivities'
import { spring } from './content/deckChoreography'
import { useDeckMetrics } from './hooks/useDeckMetrics'
import { useControlAlignment } from './hooks/useControlAlignment'
import { useDeckFit } from './hooks/useDeckFit'
import { ActivitySheet } from './components/ActivitySheet'
import { ActivityDialog } from './components/ActivityDialog'
import { MethodIndex } from './components/MethodIndex'
import { viewportSection } from '../FitSectionButton'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

export default function WorkshopMethod() {
  const [active, setActive] = useState<number | null>(null)
  const surface = useRef<HTMLElement>(null)
  const deck = useRef<HTMLDivElement>(null)
  const reduceMotion = useMediaQuery(reducedMotionQuery)
  const width = useDeckMetrics(deck)
  useControlAlignment(surface, deck)
  const available = useDeckFit(surface, deck)

  const small = width < 600
  const cardWidth = small ? Math.min(230, width - 40) : 260
  const spread = Math.min(142, Math.max(20, (width - cardWidth - 60) / 4))
  // The fan's natural height; it shrinks to fit a short viewport. An open
  // sheet is a modal over the viewport, so the fan never changes size for it.
  const closedHeight = small ? 430 : 510
  const fit = available === null ? 1 : Math.min(1, Math.max(0.55, available / closedHeight))
  const transition = reduceMotion ? { duration: 0 } : spring

  return (
    <NotebookSurface as="section" {...viewportSection} ref={surface} tone="inverse" id="workshop-method" className="notebook-section workshop-method-surface">
      <div className="page-wrap workshop-method">
        <div className="section-lede">
          <p className="eyebrow">The workshop, in five acts</p>
        </div>
        <div className="method-collection" data-notebook-independent>
          <div className="method-deck" ref={deck} style={{ height: Math.round(closedHeight * fit) }}>
            <ol className="method-sheets" aria-label="Workshop activities">
              {workshopActivities.map((activity, index) => (
                <ActivitySheet key={activity.name} activity={activity} index={index} total={workshopActivities.length} selected={active === index} small={small} fit={fit} spread={spread} cardWidth={cardWidth} reduceMotion={reduceMotion} transition={transition} onTrigger={setActive} />
              ))}
            </ol>
          </div>
          <MethodIndex activities={workshopActivities} active={active} onSelect={setActive} />
          <ActivityDialog activities={workshopActivities} active={active} onSelect={setActive} onClose={() => setActive(null)} />
        </div>
      </div>
    </NotebookSurface>
  )
}
