import type { ReactNode } from 'react'
import DodLogo from '#/components/DodLogo'
import { TabletFrame } from '#/components/TabletVideoFrame'
import { proposedLabel } from './content/proposed'
import { GuideJourney } from './GuideJourney'
import type { Mode } from './ModeControls'
import './guide.css'

type GuideFrameProps = {
  label: string
  className?: string
  mode?: Mode
  title?: ReactNode
  act?: number
  step?: number
  onSelectAct?: (act: number) => void
  bar: ReactNode
  foot?: ReactNode
  children: ReactNode
}

const guideTitle = (
  <>
    <span aria-hidden="true">↺</span> Facilitation guide
  </>
)

export function GuideFrame({ label, className, mode, title = guideTitle, act, step, onSelectAct, bar, foot, children }: GuideFrameProps) {
  return (
    <TabletFrame className="fac-tablet">
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
    </TabletFrame>
  )
}
