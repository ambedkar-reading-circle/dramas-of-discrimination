import { twoDigit } from '#/lib/format'
import type { ActivityStep } from '../content/workshopActivities'
import { stepLabel } from '../content/sheetOverlay'
import { tilts } from '../content/overlayChoreography'
import type { TriggerFor } from '../hooks/useSheetOverlay'
import { TapedButton } from './ActivityStickers'

export function ActivityStepList({ steps, triggerFor }: { steps: ActivityStep[]; triggerFor: TriggerFor }) {
  return (
    <ol className="method-instructions">
      {steps.map((step, n) =>
        step.photos?.length ? (
          <li key={step.text} className="method-instructions-sticker">
            <TapedButton className="method-step-sticker" ariaLabel={stepLabel(n, step)} tilt={tilts.stepSticker} {...triggerFor('photo', n)}>
              <span aria-hidden="true">{twoDigit(n + 1)}</span>
              <span>{step.text}</span>
            </TapedButton>
          </li>
        ) : (
          <li key={step.text}>
            <span aria-hidden="true">{twoDigit(n + 1)}</span>
            <p>{step.text}</p>
          </li>
        ),
      )}
    </ol>
  )
}
