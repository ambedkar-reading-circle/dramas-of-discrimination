import type { ReactNode, Ref } from 'react'
import './MarkButton.css'

interface MarkButtonProps {
  label: string
  mark: ReactNode
  onClick: () => void
  pressed?: boolean
  disabled?: boolean
  title?: string
  expanded?: boolean
  controls?: string
  popup?: 'dialog'
  className?: string
  ref?: Ref<HTMLButtonElement>
}

export default function MarkButton({ label, mark, onClick, pressed, disabled, title, expanded, controls, popup, className, ref }: MarkButtonProps) {
  return (
    <button ref={ref} className={className ? `mark-button ${className}` : 'mark-button'} type="button" aria-label={label} aria-pressed={pressed} aria-expanded={expanded} aria-controls={controls} aria-haspopup={popup} aria-disabled={disabled || undefined} title={title ?? label} onClick={disabled ? undefined : onClick}>
      <span className="mark-button-mark" aria-hidden="true">
        {mark}
      </span>
    </button>
  )
}

export function Mark({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

export function MarkGlyph({ children }: { children: ReactNode }) {
  return <span className="mark-button-glyph">{children}</span>
}
