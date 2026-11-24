import { motion } from 'motion/react'
import type { Transition } from 'motion/react'
import type { WorkshopActivity } from '../content/workshopActivities'
import { ActivityDrawing } from '../content/activityDrawings'
import { offsets, rotations } from '../content/deckChoreography'
import { activityDialogId } from './ActivityDialog'

interface ActivitySheetProps {
  activity: WorkshopActivity
  index: number
  total: number
  /** This sheet is the one open in the dialog. */
  selected: boolean
  small: boolean
  /** Closed-fan scale that fits the deck to the viewport. */
  fit: number
  spread: number
  cardWidth: number
  reduceMotion: boolean
  transition: Transition
  onTrigger: (index: number) => void
}

/** One card in the fanned deck. Opening it shows the full sheet in ActivityDialog. */
export function ActivitySheet({ activity, index, total, selected, small, fit, spread, cardWidth, reduceMotion, transition, onTrigger }: ActivitySheetProps) {
  const lifted = { y: (offsets[index] - 25) * fit, rotate: 0 }
  return (
    <motion.li
      className={`method-sheet ${selected ? 'method-sheet--selected' : ''}`}
      initial={false}
      animate={{ x: (index - 2) * spread, ...(selected ? lifted : { y: offsets[index] * fit, rotate: rotations[index] }), scale: (small ? 0.8 : 1) * fit }}
      transition={transition}
      whileHover={!small && !reduceMotion ? lifted : undefined}
      style={{ width: cardWidth, marginLeft: -cardWidth / 2, zIndex: selected ? 15 : index + 1, originX: 0.5, originY: 0 }}
    >
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
      <div className="method-sheet-preview">
        <ActivityDrawing name={activity.name} />
        <p>{activity.preview}</p>
      </div>
      <div className="method-sheet-footer" aria-hidden="true">
        <span>DRAMAS OF DISCRIMINATION</span>
        <span>OPEN SHEET ↗</span>
      </div>
      <button
        type="button"
        className="method-sheet-trigger"
        aria-label={`Open ${activity.name}: ${activity.title}`}
        aria-haspopup="dialog"
        aria-expanded={selected}
        aria-controls={activityDialogId}
        onClick={() => onTrigger(index)}
      >
        <span aria-hidden="true">+</span>
      </button>
    </motion.li>
  )
}
