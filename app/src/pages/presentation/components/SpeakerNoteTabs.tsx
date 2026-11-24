import { useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { twoDigit } from '#/lib/format'
import type { SpeakerNoteTab } from '../types'

interface SpeakerNoteTabsProps {
  tabs: ReadonlyArray<SpeakerNoteTab>
  selected: number
  onSelect: (index: number) => void
  /** The id of the panel the tabs switch. */
  panelId: string
}

export const speakerNoteTabId = (index: number) => `speaker-notes-tab-${index}`

/**
 * One tab per part of the slide. Arrow keys, Home and End move between them
 * and carry focus along, as a tab list does; only the selected tab is in the
 * page's Tab order.
 */
export default function SpeakerNoteTabs({ tabs, selected, onSelect, panelId }: SpeakerNoteTabsProps) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowRight: selected + 1, ArrowLeft: selected - 1, Home: 0, End: tabs.length - 1 }
    if (!(event.key in moves)) return
    event.preventDefault()
    const next = (moves[event.key] + tabs.length) % tabs.length
    onSelect(next)
    buttons.current[next]?.focus()
  }

  return (
    <div className="speaker-notes-tabs" role="tablist" aria-label="Parts of this slide" onKeyDown={onKeyDown}>
      {tabs.map((tab, i) => (
        <button
          key={tab.label}
          ref={(element) => {
            buttons.current[i] = element
          }}
          type="button"
          role="tab"
          id={speakerNoteTabId(i)}
          className="speaker-notes-tab"
          aria-selected={i === selected}
          aria-controls={panelId}
          tabIndex={i === selected ? 0 : -1}
          onClick={() => onSelect(i)}
        >
          <span className="speaker-notes-number" aria-hidden="true">
            {twoDigit(i + 1)}
          </span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
