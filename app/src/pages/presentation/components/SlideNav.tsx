import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Slide } from '../types'
import MarkButton, { MarkGlyph } from '#/components/MarkButton'

interface SlideNavProps {
  slides: ReadonlyArray<Slide>
  slide: number
  total: number
  next: () => void
  prev: () => void
  onSelect: (slide: number) => void
  onOpenOverview: () => void
}

type StripEntry = { kind: 'page'; number: number } | { kind: 'gap'; from: number; to: number }

/** Pages that fit in `slots` chips: the full run, or the ends with a window around the current page. */
function stripEntries(total: number, current: number, slots: number): StripEntry[] {
  const pages = (from: number, to: number): StripEntry[] => Array.from({ length: to - from + 1 }, (_, index) => ({ kind: 'page', number: from + index }))

  if (total <= slots) return pages(1, total)
  if (slots < 5) {
    const from = Math.max(1, Math.min(current - Math.floor((slots - 1) / 2), total - slots + 1))
    return pages(from, from + slots - 1)
  }

  const lead = slots - 2
  const windowSize = slots - 4
  const start = current - Math.floor((windowSize - 1) / 2)
  const end = start + windowSize - 1

  if (start <= 3) return [...pages(1, lead), { kind: 'gap', from: lead + 1, to: total - 1 }, { kind: 'page', number: total }]
  if (end >= total - 2) {
    const first = total - lead + 1
    return [{ kind: 'page', number: 1 }, { kind: 'gap', from: 2, to: first - 1 }, ...pages(first, total)]
  }

  return [
    { kind: 'page', number: 1 },
    { kind: 'gap', from: 2, to: start - 1 },
    ...pages(start, end),
    { kind: 'gap', from: end + 1, to: total - 1 },
    { kind: 'page', number: total },
  ]
}

function gapLabel(from: number, to: number): string {
  const slides = from === to ? `Slide ${from}` : `Slides ${from} to ${to}`
  return `${slides}, show all slides`
}

/** Previous / next, with a page window between the arrows. */
export default function SlideNav({ slides, slide, total, next, prev, onSelect, onOpenOverview }: SlideNavProps) {
  const chips = useRef<Array<HTMLButtonElement | null>>([])
  const stripRef = useRef<HTMLDivElement>(null)
  const pendingFocus = useRef<number | null>(null)
  const [slots, setSlots] = useState(total)
  const entries = stripEntries(total, slide, slots)

  // Fit the window to the strip. The chip width comes from the rendered control,
  // so a media-query change in min-width is picked up with the next resize.
  useLayoutEffect(() => {
    const strip = stripRef.current
    if (!strip) return

    const measure = () => {
      const chip = strip.querySelector<HTMLElement>('.slide-index-chip:not(.slide-index-gap)')
      if (!chip) return
      const gap = Number.parseFloat(getComputedStyle(strip).columnGap) || 0
      const chipWidth = chip.getBoundingClientRect().width
      if (chipWidth <= 0 || strip.clientWidth <= 0) return
      const next = Math.max(1, Math.floor((strip.clientWidth + gap) / (chipWidth + gap)))
      setSlots((current) => (current === next ? current : next))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(strip)
    return () => observer.disconnect()
  }, [])

  // The destination chip may not be mounted until the window re-renders.
  useEffect(() => {
    if (pendingFocus.current !== slide) return
    pendingFocus.current = null
    chips.current[slide - 1]?.focus()
  }, [slide, slots])

  const onStripKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    // Arrows inside the strip move between pages. The deck's own arrow
    // handling must not also fire for the same keystroke.
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.stopPropagation()
    event.preventDefault()
    const delta = event.key === 'ArrowLeft' ? -1 : 1
    const index = Math.min(Math.max(slide - 1 + delta, 0), slides.length - 1)
    if (index === slide - 1) return
    pendingFocus.current = index + 1
    onSelect(index + 1)
  }

  return (
    <div className="slide-nav">
      <nav className="slide-nav-controls" aria-label="Change slides">
        <MarkButton label="Previous slide" disabled={slide <= 1} onClick={prev} mark={<MarkGlyph>←</MarkGlyph>} />
        <div ref={stripRef} className="slide-index-strip" role="group" aria-label="Jump to a slide" data-lenis-prevent="" onKeyDown={onStripKeyDown}>
          {entries.map((entry) =>
            entry.kind === 'gap' ? (
              <button key={`gap-${entry.from}`} className="slide-index-chip slide-index-gap" type="button" tabIndex={-1} aria-label={gapLabel(entry.from, entry.to)} onClick={onOpenOverview}>
                …
              </button>
            ) : (
              <button
                key={slides[entry.number - 1].id}
                className="slide-index-chip"
                type="button"
                ref={(element) => {
                  chips.current[entry.number - 1] = element
                }}
                tabIndex={entry.number === slide ? 0 : -1}
                aria-current={entry.number === slide ? 'true' : undefined}
                aria-label={`Slide ${entry.number}: ${slides[entry.number - 1].heading}`}
                onClick={() => onSelect(entry.number)}
              >
                {String(entry.number).padStart(2, '0')}
              </button>
            ),
          )}
        </div>
        <MarkButton label="Next slide" disabled={slide >= total} onClick={next} mark={<MarkGlyph>→</MarkGlyph>} />
      </nav>
      <div className="slide-progress" aria-hidden="true">
        <div className="slide-progress-fill" style={{ inlineSize: `${(slide / total) * 100}%` }} />
      </div>
    </div>
  )
}
