import { useState } from 'react'

export function PairCard({ context, scenario, intervention }: { context: string; scenario: string; intervention: string }) {
  const [open, setOpen] = useState(false)
  const interventionId = `${context.replace(/\W+/g, '-').toLowerCase()}-intervention`
  return (
    <article className={`slide-card slide-pair ${open ? 'slide-card--open' : ''}`}>
      <h3>{context}</h3>
      <p className="slide-pair-scenario">{scenario}</p>
      <button className="slide-card-trigger" type="button" aria-expanded={open} aria-controls={interventionId} onClick={() => setOpen((value) => !value)}>
        <span className="notebook-text">{open ? 'Hide the intervention' : 'Reveal the intervention'}</span>
        <span className="slide-card-arrow" aria-hidden="true">
          {open ? '↑' : '↓'}
        </span>
      </button>
      <p className="slide-card-detail" id={interventionId} hidden={!open}>
        {intervention}
      </p>
    </article>
  )
}
