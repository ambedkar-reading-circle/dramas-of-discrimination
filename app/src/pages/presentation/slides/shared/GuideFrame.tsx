import type { ReactNode } from 'react'
import DodLogo from '#/components/DodLogo'
import { GuideJourney } from './GuideJourney'
import type { Mode } from './ModeControls'
import './guide.css'

type GuideFrameProps = {
  /** What the mockup shows, for screen readers. */
  label: string
  /** Classes for this slide's own styles. */
  className?: string
  /** The mode the guide runs in, if the slide shows one. */
  mode?: Mode
  /** Where the room is in the workshop journey. */
  act: number
  step: number
  onSelectAct?: (act: number) => void
  /** The top bar past its title. */
  bar: ReactNode
  /** The foot bar between the wordmark and the reading circle's logo. */
  foot?: ReactNode
  /** What lies on the desk. */
  children: ReactNode
}

/** The facilitation guide's shell: navy bars around a cream screen, the workshop journey across the top, and a desk below it. */
export function GuideFrame({ label, className, mode, act, step, onSelectAct, bar, foot, children }: GuideFrameProps) {
  return (
    <div className={['fac activity-surface', className].filter(Boolean).join(' ')} data-mode={mode} role="group" aria-label={label}>
      <header className="fac-bar">
        <span className="fac-bar-title">
          <span aria-hidden="true">↺</span> Facilitation guide
        </span>
        {bar}
      </header>

      <div className="fac-screen">
        <GuideJourney act={act} step={step} onSelect={onSelectAct} />
        <div className="fac-desk">{children}</div>
      </div>

      <footer className="fac-bar fac-bar--foot">
        <span className="fac-wordmark">
          <DodLogo variant="inline" />
        </span>
        {foot}
        <img className="fac-logo" src="/ARCLogo-blue.png" alt="Ambedkar Reading Circle" />
      </footer>
    </div>
  )
}
