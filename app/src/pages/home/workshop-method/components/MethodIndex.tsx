import type { WorkshopActivity } from '../content/workshopActivities'

interface MethodIndexProps {
  activities: WorkshopActivity[]
  active: number | null
  onSelect: (index: number) => void
}

export function MethodIndex({ activities, active, onSelect }: MethodIndexProps) {
  return (
    <>
      <nav className="method-index" aria-label="Choose a workshop activity">
        {activities.map((activity, index) => (
          <button className="method-index-button" key={activity.name} type="button" aria-pressed={active === index} onClick={() => onSelect(index)}>
            <span className="notebook-text">
              <span className="method-index-number">{String(index + 1).padStart(2, '0')}</span>
              {activity.name}
            </span>
          </button>
        ))}
      </nav>
      <p className="method-deck-hint">{active === null ? 'Select any activity to open its facilitation sheet.' : 'Choose another sheet below, or press Esc to return to the collection.'}</p>
    </>
  )
}
