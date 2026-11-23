import type { ReactNode, Ref } from 'react'

interface DeckControlProps {
  /** Accessible name. The control itself shows only its mark. */
  label: string
  mark: ReactNode
  onClick: () => void
  pressed?: boolean
  disabled?: boolean
  title?: string
  expanded?: boolean
  controls?: string
  /** Sets `aria-haspopup` when the control opens a popup. */
  popup?: 'dialog'
  ref?: Ref<HTMLButtonElement>
}

/** An icon button for the deck chrome. The mark is the whole visible control. */
export default function DeckControl({ label, mark, onClick, pressed, disabled, title, expanded, controls, popup, ref }: DeckControlProps) {
  return (
    <button ref={ref} className="deck-control" type="button" aria-label={label} aria-pressed={pressed} aria-expanded={expanded} aria-controls={controls} aria-haspopup={popup} disabled={disabled} title={title} onClick={onClick}>
      <span className="deck-control-mark" aria-hidden="true">
        {mark}
      </span>
    </button>
  )
}

/** Thin stroke icon sized by `.deck-control-mark`. */
export function DeckMark({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}
