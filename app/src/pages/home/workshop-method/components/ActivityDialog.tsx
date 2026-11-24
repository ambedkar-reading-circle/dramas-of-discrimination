import { useEffect, useRef } from 'react'
import type { WorkshopActivity } from '../content/workshopActivities'
import { ActivityDrawing } from '../content/activityDrawings'

interface ActivityDialogProps {
  activities: WorkshopActivity[]
  active: number | null
  onSelect: (index: number) => void
  onClose: () => void
}

export const activityDialogId = 'workshop-activity-dialog'

/**
 * The open facilitation sheet, as a modal over the viewport. `showModal()`
 * puts it in the top layer, so it escapes every host's transforms, clipping
 * and stacking (the home section, the /approach slide stage) and sits above
 * the site header. The page behind is inert, so the sheet carries its own
 * previous/next controls.
 */
export function ActivityDialog({ activities, active, onSelect, onClose }: ActivityDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const open = active !== null

  useEffect(() => {
    const element = dialog.current
    if (!element || !open) return
    if (!element.open) element.showModal()
    return () => {
      // close() restores focus to whatever opened the sheet.
      if (element.open) element.close()
    }
  }, [open])

  // A new act starts at its top.
  useEffect(() => {
    content.current?.scrollTo({ top: 0 })
  }, [active])

  const activity = active === null ? null : activities[active]
  const total = activities.length
  const pad = (n: number) => String(n).padStart(2, '0')
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
      onClick={(event) => {
        // The dialog box is the padded backdrop area around the sheet.
        if (event.target === event.currentTarget) onClose()
      }}
      // Keep keys here: the /approach deck turns slides on arrow keys.
      onKeyDown={(event) => event.stopPropagation()}
    >
      {activity && active !== null && (
        <article className="method-dialog-sheet" key={active}>
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
                {pad(active + 1)} / {pad(total)}
              </span>
            </div>
            <h3 id="method-dialog-title">{activity.name}</h3>
            <p className="method-sheet-subtitle">{activity.title}</p>
            <div className="method-sheet-timing">
              <span className="method-clock" aria-hidden="true" />
              {activity.duration} minutes
            </div>
          </header>
          <div ref={content} className="method-sheet-content" role="region" aria-label={`${activity.name} activity details`} tabIndex={0}>
            <p className="method-sheet-summary">{activity.summary}</p>
            <div className="method-sheet-columns">
              <div>
                <h4>IN THE ROOM</h4>
                <ol className="method-instructions">
                  {activity.steps.map((step, n) => (
                    <li key={step}>
                      <span aria-hidden="true">{pad(n + 1)}</span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <aside className="method-facilitator">
                <h4>A PROMPT TO BEGIN</h4>
                <span className="method-quote" aria-hidden="true">
                  “
                </span>
                <p>{activity.prompt}</p>
                <ActivityDrawing name={activity.name} />
              </aside>
            </div>
            <div className="method-sheet-takeaway">
              <span>TAKE FORWARD</span>
              <p>{activity.takeaway}</p>
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
    </dialog>
  )
}
