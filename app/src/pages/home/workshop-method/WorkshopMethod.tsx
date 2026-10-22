import { useRef, useState } from 'react'
import './WorkshopMethod.css'
import NotebookSurface from '#/components/NotebookSurface'
import { useMediaQuery } from '#/lib/useMediaQuery'
import { workshopActivities } from './content/workshopActivities'
import { spring } from './content/deckChoreography'
import { useDeckMetrics } from './hooks/useDeckMetrics'
import { useControlAlignment } from './hooks/useControlAlignment'
import { ActivitySheet } from './components/ActivitySheet'
import { MethodIndex } from './components/MethodIndex'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

export default function WorkshopMethod() {
  const [active, setActive] = useState<number | null>(null)
  const surface = useRef<HTMLElement>(null)
  const deck = useRef<HTMLDivElement>(null)
  const triggers = useRef<Array<HTMLButtonElement | null>>([])
  const reduceMotion = useMediaQuery(reducedMotionQuery)
  const { width, sheetHeight } = useDeckMetrics(deck, active)
  useControlAlignment(surface, deck)

  const small = width < 600
  const cardWidth = small ? Math.min(230, width - 40) : 260
  const spread = Math.min(142, Math.max(20, (width - cardWidth - 60) / 4))
  const transition = reduceMotion ? { duration: 0 } : spring
  const select = (index: number) => {
    setActive((current) => (current === index ? null : index))
    // Keep the new sheet visible when switching from the lower index.
    requestAnimationFrame(() => deck.current?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'instant' : 'smooth' }))
  }

  return (
    <NotebookSurface
      as="section"
      ref={surface}
      tone="inverse"
      id="workshop-method"
      className="notebook-section workshop-method-surface"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && active !== null) {
          triggers.current[active]?.focus()
          setActive(null)
        }
      }}
    >
      <div className="page-wrap workshop-method">
        <div className="section-lede">
          <p className="eyebrow">The workshop, in five acts</p>
        </div>
        <div className="method-collection" data-notebook-independent>
          <div className="method-deck" ref={deck} style={{ height: active === null ? (small ? 475 : 550) : sheetHeight + 165 }}>
            <ol className="method-sheets" aria-label="Workshop activities">
              {workshopActivities.map((activity, index) => (
                <ActivitySheet key={activity.name} activity={activity} index={index} total={workshopActivities.length} active={active} small={small} spread={spread} width={width} cardWidth={cardWidth} sheetHeight={sheetHeight} reduceMotion={reduceMotion} transition={transition} onTrigger={select} registerTrigger={triggers.current} />
              ))}
            </ol>
          </div>
          <MethodIndex activities={workshopActivities} active={active} onSelect={select} />
        </div>
      </div>
    </NotebookSurface>
  )
}
