import { useEffect, useRef } from 'react'
import '../ActivityOverlays.css'
import { twoDigit } from '#/lib/format'
import { useLatest } from '#/lib/use-latest'
import type { WorkshopActivity } from '../content/workshopActivities'
import { ActivityDrawing } from '../content/activityDrawings'
import { resolveOverlay } from '../content/sheetOverlay'
import type { OverlayTarget } from '../content/sheetOverlay'
import { useSheetOverlay } from '../hooks/useSheetOverlay'
import { WorksheetStickers, ManualStickers } from './ActivityStickers'
import { ActivityStepList } from './ActivityStepList'
import { SheetOverlay } from './SheetOverlay'

interface ActivityDialogProps {
  activities: WorkshopActivity[]
  active: number | null
  shown: OverlayTarget | null
  onShow: (target: OverlayTarget | null) => void
  onSelect: (index: number) => void
  onClose: () => void
  modeless?: boolean
}

export const activityDialogId = 'workshop-activity-dialog'
const overlayId = 'workshop-activity-overlay'

export function ActivityDialog({ activities, active, shown, onShow, onSelect, onClose, modeless = false }: ActivityDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const open = active !== null
  const activity = active === null ? null : activities[active]
  const overlay = useSheetOverlay(shown, onShow, overlayId)
  const overlayContent = activity ? resolveOverlay(activity, shown) : null
  const overlayOpen = overlayContent !== null

  useEffect(() => {
    const element = dialog.current
    if (!element || !open) return
    if (modeless) return showModeless(element)
    if (!element.open) element.showModal()
    return () => {
      if (element.open) element.close()
    }
  }, [open, modeless])

  const dismiss = useLatest(() => (overlayOpen ? overlay.close() : onClose()))
  useEffect(() => {
    if (!open || !modeless) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      event.preventDefault()
      dismiss.current()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, modeless, dismiss])

  useEffect(() => {
    content.current?.scrollTo({ top: 0 })
  }, [active])

  const total = activities.length
  const previous = active !== null && active > 0 ? active - 1 : null
  const next = active !== null && active < total - 1 ? active + 1 : null

  return (
    <dialog
      ref={dialog}
      id={activityDialogId}
      className="method-dialog"
      aria-labelledby={activity ? 'method-dialog-title' : undefined}
      data-lenis-prevent=""
      onClose={onClose}
      popover={modeless ? 'manual' : undefined}
      onCancel={(event) => {
        if (!overlayOpen) return
        event.preventDefault()
        overlay.close()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        if (overlayOpen) overlay.close()
        else onClose()
      }}
      onKeyDown={(event) => {
        if (!modeless) event.stopPropagation()
      }}
    >
      {activity && active !== null && (
        <article className="method-dialog-sheet" key={active} inert={overlayOpen}>
          <button type="button" className="method-dialog-close" aria-label="Close sheet" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="m5 5 14 14M19 5 5 19" />
            </svg>
          </button>
          <header className="method-dialog-header">
            <div className="method-sheet-topline">
              <span>
                workshop
                <br />
                activity
              </span>
              <span>
                {twoDigit(active + 1)} / {twoDigit(total)}
              </span>
            </div>
            <h3 id="method-dialog-title">{activity.name}</h3>
            <p className="method-sheet-subtitle">{activity.title}</p>
            <div className="method-sheet-timing">
              <span className="method-clock" aria-hidden="true" />
              {activity.duration} minutes
            </div>
          </header>
          <ManualStickers activity={activity} triggerFor={overlay.triggerFor} />
          <div ref={content} className="method-sheet-content" role="region" aria-label={`${activity.name} activity details`} tabIndex={0}>
            <p className="method-sheet-summary">{activity.summary}</p>
            <div className="method-sheet-columns">
              <div>
                <h4>ACTIVITIES</h4>
                <ActivityStepList steps={activity.steps} triggerFor={overlay.triggerFor} />
              </div>
              <aside className="method-facilitator">
                <h4>A PROMPT TO BEGIN</h4>
                <span className="method-quote" aria-hidden="true">
                  “
                </span>
                <p>{activity.prompt}</p>
                <ActivityDrawing name={activity.name} />
                <WorksheetStickers activity={activity} triggerFor={overlay.triggerFor} />
              </aside>
            </div>
          </div>
          <nav className="method-dialog-footer" aria-label="Other activities">
            <button type="button" className="method-dialog-step" disabled={previous === null} onClick={() => previous !== null && onSelect(previous)}>
              <span aria-hidden="true">←</span> {previous !== null ? activities[previous].name : 'Start'}
            </button>
            <span className="method-dialog-mark" aria-hidden="true">
              ARC / FACILITATION NOTES
            </span>
            <button type="button" className="method-dialog-step" disabled={next === null} onClick={() => next !== null && onSelect(next)}>
              {next !== null ? activities[next].name : 'End'} <span aria-hidden="true">→</span>
            </button>
          </nav>
        </article>
      )}
      {activity && <SheetOverlay id={overlayId} content={overlayContent} onClose={overlay.close} />}
    </dialog>
  )
}

function showModeless(element: HTMLDialogElement) {
  const from = document.activeElement
  if (!element.matches(':popover-open')) element.showPopover()
  if (from instanceof HTMLElement && !element.parentElement?.contains(from)) from.focus({ preventScroll: true })
  return () => {
    const hadFocus = element.contains(document.activeElement)
    if (element.matches(':popover-open')) element.hidePopover()
    if (hadFocus && from instanceof HTMLElement && from.isConnected) from.focus({ preventScroll: true })
  }
}
