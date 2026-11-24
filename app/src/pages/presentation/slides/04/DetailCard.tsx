import { useState } from 'react'

export function DetailCard({ title, detail }: { title: string; detail: string }) {
  const [open, setOpen] = useState(false)
  const detailId = `${title.replace(/\W+/g, '-').toLowerCase()}-detail`
  return (
    <article className={`slide-card ${open ? 'slide-card--open' : ''}`}>
      <h3>{title}</h3>
      <button className="slide-card-trigger" type="button" aria-expanded={open} aria-controls={detailId} onClick={() => setOpen((value) => !value)}>
        <span className="notebook-text">{open ? 'Hide' : 'Reveal'}</span>
        <span className="slide-card-arrow" aria-hidden="true">
          {open ? '↑' : '↓'}
        </span>
      </button>
      <p className="slide-card-detail" id={detailId} hidden={!open}>
        {detail}
      </p>
    </article>
  )
}
