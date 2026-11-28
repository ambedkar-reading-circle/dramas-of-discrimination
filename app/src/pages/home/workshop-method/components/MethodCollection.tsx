import { useRef, useState } from 'react'
import '../WorkshopMethod.css'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { workshopActivities } from '../content/workshopActivities'
import { spring } from '../content/deckChoreography'
import { useDeckLayout } from '../hooks/useDeckLayout'
import type { DeckFitTarget } from '../hooks/useDeckFit'
import type { OverlayTarget } from '../content/sheetOverlay'
import { ActivitySheet } from './ActivitySheet'
import { ActivityDialog } from './ActivityDialog'
import { MethodIndex } from './MethodIndex'

export type SheetView = Readonly<{ act: number; show: OverlayTarget | null }>

type MethodCollectionProps = {
  fitTo?: DeckFitTarget
  hint?: boolean
  highlight?: number | null
  view?: SheetView | null
  onViewChange?: (view: SheetView | null) => void
  modeless?: boolean
}

export function MethodCollection({ fitTo, hint = true, highlight = null, view: heldView, onViewChange, modeless = false }: MethodCollectionProps) {
  const [ownView, setOwnView] = useState<SheetView | null>(null)
  const view = heldView === undefined ? ownView : heldView
  const setView = (next: SheetView | null) => {
    setOwnView(next)
    onViewChange?.(next)
  }
  const active = view?.act ?? null
  const setActive = (act: number | null) => setView(act === null ? null : { act, show: null })
  const lifted = active ?? highlight
  const deck = useRef<HTMLDivElement>(null)
  const reduceMotion = usePrefersReducedMotion()
  const geometry = useDeckLayout(deck, fitTo)
  const transition = reduceMotion ? { duration: 0 } : spring

  return (
    <div className="method-collection activity-surface" data-notebook-independent>
      <div className="method-deck" ref={deck} style={{ height: geometry.height }}>
        <ol className="method-sheets" aria-label="Workshop activities">
          {workshopActivities.map((activity, index) => (
            <ActivitySheet key={activity.name} activity={activity} index={index} total={workshopActivities.length} selected={lifted === index} expanded={active === index} geometry={geometry} reduceMotion={reduceMotion} transition={transition} onTrigger={setActive} />
          ))}
        </ol>
      </div>
      <MethodIndex activities={workshopActivities} active={lifted} onSelect={setActive} hint={hint} />
      <ActivityDialog
        activities={workshopActivities}
        active={active}
        shown={view?.show ?? null}
        onShow={(show) => {
          if (active !== null) setView({ act: active, show })
        }}
        onSelect={setActive}
        onClose={() => setActive(null)}
        modeless={modeless}
      />
    </div>
  )
}
