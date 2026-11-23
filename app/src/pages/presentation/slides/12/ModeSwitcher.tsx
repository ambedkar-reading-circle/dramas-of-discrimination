import { useState } from 'react'

export function ModeSwitcher() {
  const modes = {
    local: {
      label: 'Local mode',
      summary: 'Everything runs in one browser on one device.',
      detail: 'The Rehearsal lives in browser storage; there is no account, and nothing leaves the device. Prompt export renders the tables as a copy-paste prompt for your own LLM.',
    },
    cloud: {
      label: 'Cloud mode',
      summary: 'The Community opts in, and work syncs.',
      detail: 'A Facilitator registers the Community, creates its Groups, and issues Join codes. Members join their Group from their own devices, and every Rehearsal syncs to its Workshop.',
    },
  } as const
  const [mode, setMode] = useState<'local' | 'cloud'>('local')
  const active = modes[mode]
  return (
    <div className="slide-modes">
      <div className="slide-mode-buttons" role="group" aria-label="Choose a platform mode">
        <button className={`slide-mode-button ${mode === 'local' ? 'slide-mode-button--active' : ''}`} type="button" aria-pressed={mode === 'local'} onClick={() => setMode('local')}>
          <span className="notebook-text">{modes.local.label}</span>
        </button>
        <button className={`slide-mode-button ${mode === 'cloud' ? 'slide-mode-button--active' : ''}`} type="button" aria-pressed={mode === 'cloud'} onClick={() => setMode('cloud')}>
          <span className="notebook-text">{modes.cloud.label}</span>
        </button>
      </div>
      <div className="slide-mode-panel" key={mode}>
        <h3>{active.label}</h3>
        <p>{active.summary}</p>
        <p className="text-ink-soft">{active.detail}</p>
      </div>
    </div>
  )
}
