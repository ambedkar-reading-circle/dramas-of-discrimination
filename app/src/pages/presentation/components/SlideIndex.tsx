import { useEffect, useRef } from 'react'
import type { Slide } from '../types'
import MarkButton, { Mark } from '#/components/MarkButton'

interface SlideIndexProps {
  slides: ReadonlyArray<Slide>
  current: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (slide: number) => void
  onFocusStage: () => void
}

/** Opens the slide grid. Rendered beside the fullscreen control, not in the deck flow. */
export function SlideOverviewControl({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  return <MarkButton label="Overview" expanded={open} controls="slide-overview" popup="dialog" onClick={onOpen} mark={<OverviewMark />} />
}

/** Overview dialog. The slide grid opens as a modal over the deck. */
export default function SlideIndex({ slides, current, open, onOpenChange, onSelect, onFocusStage }: SlideIndexProps) {
  const cards = useRef<Array<HTMLButtonElement | null>>([])
  const dialog = useRef<HTMLDialogElement>(null)
  // Distinguishes a programmatic close (effect cleanup, choosing a slide)
  // from Escape or a backdrop click, which must sync the open state.
  const ignoreClose = useRef(false)
  const selecting = useRef(false)

  useEffect(() => {
    const element = dialog.current
    if (!element || !open) return
    if (!element.open) element.showModal()
    const card = cards.current[current - 1]
    card?.focus({ preventScroll: true })
    return () => {
      if (!element.open) return
      ignoreClose.current = true
      element.close()
    }
  }, [open, current])

  const onDialogClose = () => {
    const programmatic = ignoreClose.current
    ignoreClose.current = false
    const jumped = selecting.current
    selecting.current = false
    if (!programmatic) onOpenChange(false)
    // close() restores focus to the overview button on a later task. After
    // that, move focus to the heading the stage names — the slide being
    // exited is still mounted for the transition.
    if (jumped) {
      window.setTimeout(() => {
        window.setTimeout(() => onFocusStage(), 0)
      }, 0)
    }
  }

  const choose = (slide: number) => {
    selecting.current = true
    onSelect(slide)
  }

  return (
    <div className="slide-index">
      <dialog
        ref={dialog}
        className="slide-overview-dialog"
        aria-labelledby="slide-overview-title"
        data-lenis-prevent=""
        onClose={onDialogClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) onOpenChange(false)
        }}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <div className="slide-overview-panel">
          <div className="slide-overview-bar">
            <p id="slide-overview-title" className="eyebrow">
              <span>All slides</span>
            </p>
            <MarkButton label="Close overview" onClick={() => onOpenChange(false)} mark={<CloseOverviewMark />} />
          </div>
          <div className="slide-overview" id="slide-overview">
            {slides.map((slide, index) => (
              <button
                className="slide-overview-card"
                key={slide.id}
                type="button"
                ref={(element) => {
                  cards.current[index] = element
                }}
                aria-current={index === current - 1 ? 'true' : undefined}
                onClick={() => choose(index + 1)}
              >
                <span className="slide-overview-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="slide-overview-heading">{slide.heading}</span>
              </button>
            ))}
          </div>
        </div>
      </dialog>
    </div>
  )
}

function OverviewMark() {
  return (
    <Mark>
      <rect x="2" y="2" width="5" height="5" />
      <rect x="9" y="2" width="5" height="5" />
      <rect x="2" y="9" width="5" height="5" />
      <rect x="9" y="9" width="5" height="5" />
    </Mark>
  )
}

function CloseOverviewMark() {
  return (
    <Mark>
      <path d="m3.5 3.5 9 9M12.5 3.5l-9 9" />
    </Mark>
  )
}
