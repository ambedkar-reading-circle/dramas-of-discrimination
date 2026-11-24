import { useEffect, useRef, useState } from 'react'
import type { Slide } from '../types'
import MarkButton, { Mark } from '#/components/MarkButton'
import { twoDigit } from '#/lib/format'
import SpeakerNoteTabs, { speakerNoteTabId } from './SpeakerNoteTabs'

/** Shown until a slide has its own speaker notes written. */
const PLACEHOLDER_NOTES: ReadonlyArray<string> = ['Speaker notes for this slide still to be written.', 'Each point is one thing the presenter says, in order.', 'A visitor without a presenter reads the same points.']
const PLACEHOLDER_TAB_NOTES: ReadonlyArray<string> = ['Speaker notes for this part still to be written.', ...PLACEHOLDER_NOTES.slice(1)]

interface SpeakerNotesProps {
  slide: Slide
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Opens the current slide's speaker notes. Rendered beside the overview and fullscreen controls. */
export function SpeakerNotesControl({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  return <MarkButton label="Speaker notes" expanded={open} controls="speaker-notes" popup="dialog" onClick={onOpen} mark={<SpeakerNotesMark />} />
}

/** Speaker notes dialog: what to say over the slide on stage. */
export default function SpeakerNotes({ slide, open, onOpenChange }: SpeakerNotesProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  // A programmatic close (effect cleanup) must not echo back as a state change.
  const ignoreClose = useRef(false)
  // A slide without tabs is read as one untitled part, so the rest of the
  // dialog handles both the same way.
  const tabs = slide.speakerNoteTabs
  const parts = tabs ?? [{ label: '', speakerNotes: slide.speakerNotes }]
  // The open part per slide id, kept like the ticks below.
  const [openTabs, setOpenTabs] = useState<Readonly<Record<string, number>>>({})
  const tab = Math.min(openTabs[slide.id] ?? 0, parts.length - 1)
  const selectTab = (index: number) => setOpenTabs((all) => ({ ...all, [slide.id]: index }))
  const notes = parts[tab]?.speakerNotes
  const placeholder = tabs ? PLACEHOLDER_TAB_NOTES : PLACEHOLDER_NOTES
  const points = notes?.length ? notes : placeholder
  // Ticked points per slide id and part. Kept while the deck is mounted, so
  // moving between slides keeps each slide's progress.
  const [checked, setChecked] = useState<Readonly<Record<string, ReadonlyArray<number>>>>({})
  const tickKey = `${slide.id}:${tab}`
  const ticked = checked[tickKey] ?? []
  const toggle = (point: number) => {
    setChecked((all) => {
      const current = all[tickKey] ?? []
      const next = current.includes(point) ? current.filter((p) => p !== point) : [...current, point]
      return { ...all, [tickKey]: next }
    })
  }

  useEffect(() => {
    const element = dialog.current
    if (!element || !open) return
    if (!element.open) element.showModal()
    return () => {
      if (!element.open) return
      ignoreClose.current = true
      element.close()
    }
  }, [open])

  const onDialogClose = () => {
    const programmatic = ignoreClose.current
    ignoreClose.current = false
    if (!programmatic) onOpenChange(false)
  }

  return (
    <div className="speaker-notes">
      <dialog
        ref={dialog}
        className="speaker-notes-dialog"
        aria-label="Speaker notes"
        data-lenis-prevent=""
        onClose={onDialogClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) onOpenChange(false)
        }}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <div className="speaker-notes-panel">
          <MarkButton label="Close speaker notes" className="speaker-notes-close" onClick={() => onOpenChange(false)} mark={<CloseNotesMark />} />
          {tabs && <SpeakerNoteTabs tabs={tabs} selected={tab} onSelect={selectTab} panelId="speaker-notes" />}
          <ol
            className={notes?.length ? 'speaker-notes-points' : 'speaker-notes-points is-placeholder'}
            id="speaker-notes"
            {...(tabs ? { role: 'tabpanel', 'aria-labelledby': speakerNoteTabId(tab) } : {})}
          >
            {points.map((point, i) => (
              <li key={i}>
                <label className="speaker-notes-point">
                  <input className="speaker-notes-check" type="checkbox" checked={ticked.includes(i)} onChange={() => toggle(i)} />
                  <span className="speaker-notes-number" aria-hidden="true">
                    {twoDigit(i + 1)}
                  </span>
                  <span>{point}</span>
                </label>
              </li>
            ))}
          </ol>
        </div>
      </dialog>
    </div>
  )
}

/** A person with an exclamation point: someone has something to say. */
function SpeakerNotesMark() {
  return (
    <Mark>
      <circle cx="6" cy="5" r="2.5" />
      <path d="M1.5 14v-1a4 4 0 0 1 4-4h1a4 4 0 0 1 2.6 1" />
      <path d="M13 3.5v5.5M13 12.5v.01" />
    </Mark>
  )
}

function CloseNotesMark() {
  return (
    <Mark>
      <path d="m3.5 3.5 9 9M12.5 3.5l-9 9" />
    </Mark>
  )
}
