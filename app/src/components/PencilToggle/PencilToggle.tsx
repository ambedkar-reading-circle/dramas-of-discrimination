import type { ReactNode } from 'react'
import { usePencilPreference } from '#/lib/pencil'
import './PencilToggle.css'

export default function PencilToggle() {
  const { enabled, toggleEnabled } = usePencilPreference()
  const label = enabled ? 'Turn pencil off' : 'Turn pencil on'

  return (
    <button type="button" onClick={toggleEnabled} aria-pressed={enabled} aria-label={label} title={label} className="pencil-toggle">
      <span className="pencil-toggle-window" aria-hidden="true">
        <span className="pencil-toggle-track">
          <PencilMark>
            <path d="M13 21h8" />
            <path d="m15 5 4 4" />
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
          </PencilMark>
          <PencilMark>
            <path d="m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982" />
            <path d="m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353" />
            <path d="m15 5 4 4" />
            <path d="m2 2 20 20" />
          </PencilMark>
        </span>
      </span>
    </button>
  )
}

function PencilMark({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}
