import type { WorkshopActivity } from '../content/workshopActivities'
import { twoDigit } from '#/lib/format'

interface MethodIndexProps {
  activities: WorkshopActivity[]
  active: number | null
  onSelect: (index: number) => void
  hint?: boolean
}

export function MethodIndex({ activities, active, onSelect, hint = true }: MethodIndexProps) {
  return (
    <>
      <nav className="method-index" aria-label="Choose a workshop activity">
        {activities.map((activity, index) => (
          <button className="method-index-button" key={activity.name} type="button" aria-haspopup="dialog" aria-current={active === index ? 'true' : undefined} onClick={() => onSelect(index)}>
            <span className="notebook-text">
              <span className="method-index-number">{twoDigit(index + 1)}</span>
              {activity.name}
            </span>
          </button>
        ))}
      </nav>
      {hint && <p className="method-deck-hint">Select any activity to open its facilitation sheet.</p>}
    </>
  )
}
