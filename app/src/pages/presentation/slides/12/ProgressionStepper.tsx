import { useState } from 'react'
import { twoDigit } from '#/lib/format'

export function ProgressionStepper() {
  const stages = [
    { name: 'Sign-off', detail: 'Each Member declares the Group’s Rehearsal ready. The Group shows its Sign-off count — x of y — to its Members and the Facilitator.' },
    { name: 'Submission', detail: 'The Facilitator hands the Rehearsal over to its Workshop. Ideally every Member has signed off; a shorter count is permitted and recorded as forced.' },
    { name: 'Generate', detail: 'When every Rehearsal is submitted, the Facilitator triggers Generate: all the Actor maps and Play scripts become one input.' },
    { name: 'Manifesto draft', detail: 'The Workshop returns the manifesto draft — the Community’s manifesto of inclusion, written from its own rehearsals.' },
  ]
  const [stage, setStage] = useState(0)
  return (
    <div className="slide-steps">
      <ol className="slide-steps-list">
        {stages.map((item, index) => (
          <li className={`slide-step ${index === stage ? 'slide-step--current' : ''} ${index < stage ? 'slide-step--done' : ''}`} key={item.name}>
            <button className="slide-step-button" type="button" disabled={index > stage} aria-current={index === stage ? 'step' : undefined} onClick={() => setStage(index)}>
              <span className="step-number" aria-hidden="true">
                {twoDigit(index + 1)}
              </span>
              <span className="notebook-text">{item.name}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="slide-step-detail" aria-live="polite">
        {stages[stage].detail}
      </p>
      <button className="slide-points-next" type="button" onClick={() => setStage((value) => Math.min(value + 1, stages.length - 1))} disabled={stage === stages.length - 1}>
        <span className="notebook-text">Advance one stage</span>
      </button>
    </div>
  )
}
