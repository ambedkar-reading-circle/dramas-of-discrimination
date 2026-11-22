import { motion } from 'motion/react'
import type { Transition } from 'motion/react'
import type { RefObject } from 'react'
import type { WorkshopActivity } from '../content/workshopActivities'
import { ActivityDrawing } from '../content/activityDrawings'
import { offsets, rotations } from '../content/deckChoreography'

interface ActivitySheetProps {
  activity: WorkshopActivity
  index: number
  total: number
  active: number | null
  small: boolean
  spread: number
  width: number
  cardWidth: number
  sheetHeight: number
  reduceMotion: boolean
  transition: Transition
  onTrigger: (index: number) => void
  registerTrigger: RefObject<Array<HTMLButtonElement | null>>['current']
}

export function ActivitySheet({ activity, index, total, active, small, spread, width, cardWidth, sheetHeight, reduceMotion, transition, onTrigger, registerTrigger }: ActivitySheetProps) {
  const selected = active === index
  const gathered = active !== null && !selected
  const dockIndex = active === null ? index : index > active ? index - 1 : index
  const sheetWidth = selected ? Math.min(760, width - 12) : cardWidth
  return (
    <motion.li key={activity.name} className={`method-sheet ${selected ? 'method-sheet--open' : ''} ${gathered ? 'method-sheet--gathered' : ''}`} layout={!reduceMotion} initial={false} animate={{ x: selected ? 0 : gathered ? (dockIndex - 1.5) * (small ? 55 : 72) : (index - 2) * spread, y: selected ? 0 : gathered ? sheetHeight + 30 : offsets[index], rotate: selected ? 0 : gathered ? (dockIndex - 1.5) * 5 : rotations[index], scale: gathered ? 0.26 : selected || !small ? 1 : 0.8 }} transition={transition} whileHover={!small && !selected && !gathered && !reduceMotion ? { y: offsets[index] - 25, rotate: 0 } : undefined} style={{ width: sheetWidth, marginLeft: -sheetWidth / 2, zIndex: selected ? 20 : index + 1, originX: 0.5, originY: 0 }}>
      <div className="method-sheet-topline">
        <span>
          workshop
          <br />
          activity
        </span>
        <span>
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
      <h3>{activity.name}</h3>
      <p className="method-sheet-subtitle">{activity.title}</p>
      <div className="method-sheet-timing">
        <span className="method-clock" aria-hidden="true" />
        {activity.duration} minutes
      </div>
      {!selected && (
        <div className="method-sheet-preview">
          <ActivityDrawing name={activity.name} />
          <p>{activity.preview}</p>
        </div>
      )}
      {selected && (
        <motion.div id={`activity-${index}-content`} className="method-sheet-content" role="region" aria-label={`${activity.name} activity details`} tabIndex={0} data-lenis-prevent initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.25, delay: reduceMotion ? 0 : 0.12 }}>
          <p className="method-sheet-summary">{activity.summary}</p>
          <div className="method-sheet-columns">
            <div>
              <h4>IN THE ROOM</h4>
              <ol className="method-instructions">
                {activity.steps.map((step, n) => (
                  <li key={step}>
                    <span aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
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
        </motion.div>
      )}
      <div className="method-sheet-footer" aria-hidden="true">
        <span>DRAMAS OF DISCRIMINATION</span>
        <span>{selected ? 'ARC / FACILITATION NOTES' : 'OPEN SHEET ↗'}</span>
      </div>
      <button
        ref={(element) => {
          registerTrigger[index] = element
        }}
        type="button"
        className="method-sheet-trigger"
        aria-label={`${selected ? 'Close' : 'Open'} ${activity.name}: ${activity.title}`}
        aria-expanded={selected}
        aria-controls={selected ? `activity-${index}-content` : undefined}
        onClick={() => onTrigger(index)}
      >
        {selected ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="m5 5 14 14M19 5 5 19" />
          </svg>
        ) : (
          <span aria-hidden="true">+</span>
        )}
      </button>
    </motion.li>
  )
}
