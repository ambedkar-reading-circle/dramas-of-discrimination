import { useEffect, useRef, useState } from 'react'
import type { Slide } from '../types'
import MarkButton, { Mark } from '#/components/MarkButton'

/** Shown until a slide has its own speaker notes written. */
const PLACEHOLDER_NOTES: ReadonlyArray<string> = ['Speaker notes for this slide still to be written.', 'Each point is one thing the presenter says, in order.', 'A visitor without a presenter reads the same points.']

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
  const points = slide.speakerNotes?.length ? slide.speakerNotes : PLACEHOLDER_NOTES
  // Ticked points per slide id. Kept while the deck is mounted, so moving
  // between slides keeps each slide's progress.
  const [checked, setChecked] = useState<Readonly<Record<string, ReadonlyArray<number>>>>({})
  const ticked = checked[slide.id] ?? []
  const toggle = (point: number) => {
    setChecked((all) => {
      const current = all[slide.id] ?? []
      const next = current.includes(point) ? current.filter((p) => p !== point) : [...current, point]
      return { ...all, [slide.id]: next }
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
          <ol className={slide.speakerNotes?.length ? 'speaker-notes-points' : 'speaker-notes-points is-placeholder'} id="speaker-notes">
            {points.map((point, i) => (
              <li key={i}>
                <label className="speaker-notes-point">
                  <input className="speaker-notes-check" type="checkbox" checked={ticked.includes(i)} onChange={() => toggle(i)} />
                  <span className="speaker-notes-number" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
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
