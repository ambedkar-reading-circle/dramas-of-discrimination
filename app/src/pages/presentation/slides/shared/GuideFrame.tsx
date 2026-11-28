import type { ReactNode } from 'react'
import DodLogo from '#/components/DodLogo'
import { proposedLabel } from './content/proposed'
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
  /** The top bar's title; the facilitation guide's, unless the screen is another. */
  title?: ReactNode
  /** Where the room is in the workshop journey; a screen above the Workshop shows none. */
  act?: number
  step?: number
  onSelectAct?: (act: number) => void
  /** The top bar past its title. */
  bar: ReactNode
  /** The foot bar between the wordmark and the reading circle's logo. */
  foot?: ReactNode
  /** What lies on the desk. */
  children: ReactNode
}

const guideTitle = (
  <>
    <span aria-hidden="true">↺</span> Facilitation guide
  </>
)

/**
 * The facilitation guide's shell: navy bars around a cream screen, the
 * workshop journey across the top, and a desk below it. The guide is a
 * proposal still being built, and its foot bar says so on every slide.
 */
export function GuideFrame({ label, className, mode, title = guideTitle, act, step, onSelectAct, bar, foot, children }: GuideFrameProps) {
  return (
    <div className={['fac activity-surface', className].filter(Boolean).join(' ')} data-mode={mode} role="group" aria-label={label}>
      <header className="fac-bar">
        <span className="fac-bar-title">{title}</span>
        {bar}
      </header>

      <div className="fac-screen">
        {act !== undefined && step !== undefined && <GuideJourney act={act} step={step} onSelect={onSelectAct} />}
        <div className="fac-desk">{children}</div>
      </div>

      <footer className="fac-bar fac-bar--foot">
        <span className="fac-wordmark">
          <DodLogo variant="inline" />
        </span>
        <span className="fac-proposed">{proposedLabel}</span>
        {foot}
        <img className="fac-logo" src="/ARCLogo-blue.png" alt="Ambedkar Reading Circle" />
      </footer>
    </div>
  )
}
