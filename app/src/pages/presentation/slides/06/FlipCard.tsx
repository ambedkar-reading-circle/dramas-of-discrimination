import { useState } from 'react'

export function FlipCard({ title, front, back }: { title: string; front: string; back: string }) {
  const [open, setOpen] = useState(false)
  return (
    <article className={`slide-flip ${open ? 'slide-flip--open' : ''}`}>
      <div className="slide-flip-inner">
        <div className="slide-flip-face slide-flip-face--front">
          <h3>{title}</h3>
          <p>{front}</p>
          <span className="slide-flip-hint" aria-hidden="true">
            Turn over ↻
          </span>
        </div>
        <div className="slide-flip-face slide-flip-face--back" aria-hidden={!open}>
          <h3>{title}</h3>
          <p>{back}</p>
          <span className="slide-flip-hint" aria-hidden="true">
            Turn back ↺
          </span>
        </div>
      </div>
      <button className="slide-flip-trigger" type="button" aria-expanded={open} aria-label={open ? `Turn ${title} back` : `Turn ${title} over`} onClick={() => setOpen((value) => !value)} />
    </article>
  )
}
