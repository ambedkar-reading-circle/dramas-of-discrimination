import type { ReactNode, Ref } from 'react'
import './MarkButton.css'

interface MarkButtonProps {
  /** Accessible name. The button itself shows only its mark. */
  label: string
  /** An icon (a `Mark`, a lucide icon) or a single glyph via `MarkGlyph`. */
  mark: ReactNode
  onClick: () => void
  pressed?: boolean
  /**
   * Shown and announced as unavailable, but left focusable (`aria-disabled`),
   * so a keyboard visitor pressing it to its last step keeps their place.
   */
  disabled?: boolean
  /** The tooltip; the label by default, since the mark alone shows no words. */
  title?: string
  expanded?: boolean
  controls?: string
  /** Sets `aria-haspopup` when the button opens a popup. */
  popup?: 'dialog'
  /** Placement or context hooks; the look stays the shared one. */
  className?: string
  ref?: Ref<HTMLButtonElement>
}

/**
 * A small square button whose mark is the whole visible control: tool chrome
 * such as slide arrows, fullscreen, or fitting a section. Text calls to action
 * use ActionButton instead.
 */
export default function MarkButton({ label, mark, onClick, pressed, disabled, title, expanded, controls, popup, className, ref }: MarkButtonProps) {
  return (
    <button ref={ref} className={className ? `mark-button ${className}` : 'mark-button'} type="button" aria-label={label} aria-pressed={pressed} aria-expanded={expanded} aria-controls={controls} aria-haspopup={popup} aria-disabled={disabled || undefined} title={title ?? label} onClick={disabled ? undefined : onClick}>
      <span className="mark-button-mark" aria-hidden="true">
        {mark}
      </span>
    </button>
  )
}

/** Thin stroke icon on a 16-unit grid, sized by `.mark-button-mark`. */
export function Mark({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

/** A single typed character (←, →, …) used as a mark. */
export function MarkGlyph({ children }: { children: ReactNode }) {
  return <span className="mark-button-glyph">{children}</span>
}
