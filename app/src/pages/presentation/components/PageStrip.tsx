import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ComponentProps, FocusEvent, KeyboardEvent } from 'react'
import { observeResize } from '#/lib/observe-resize'
import { keyName, plainKey } from '../keyTargets'
import { slideLabel } from '../slideLabel'
import type { Slide } from '../types'

interface PageStripProps {
  slides: ReadonlyArray<Slide>
  slide: number
  onSelect: (slide: number) => void
  /** How the current slide's square reads; its plain number when left out. */
  current?: CurrentPage
  /** Focus the current slide's square on mount, for a control that removed itself to show the strip. */
  focusOnMount?: boolean
}

/** The current slide's square: what it shows, such as its number with the point the deck is on (4.2), and what its accessible name adds, such as ", point 2 of 9". */
export type CurrentPage = Readonly<{ label: string; note: string }>

/** One slide's numbered square, in the strip or beside the caption. The current one is filled. */
export function PageChip({ current = false, className, ...button }: ComponentProps<'button'> & { current?: boolean }) {
  return <button type="button" className={className ? `slide-index-chip ${className}` : 'slide-index-chip'} aria-current={current ? 'true' : undefined} {...button} />
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

  return [{ kind: 'page', number: 1 }, { kind: 'gap', from: 2, to: start - 1 }, ...pages(start, end), { kind: 'gap', from: end + 1, to: total - 1 }, { kind: 'page', number: total }]
}

/**
 * Every slide as a numbered square, filling the middle of the player while
 * captions are off. Too narrow for all of them, it keeps the ends and a
 * window around the current slide. Arrow keys move between pages; only the
 * current page is in the Tab order.
 */
export default function PageStrip({ slides, slide, onSelect, current, focusOnMount = false }: PageStripProps) {
  const total = slides.length
  const chips = useRef<Array<HTMLButtonElement | null>>([])
  const strip = useRef<HTMLDivElement>(null)
  const pendingFocus = useRef<number | null>(focusOnMount ? slide : null)
  const [slots, setSlots] = useState(total)
  const entries = stripEntries(total, slide, slots)

  // Fit the window to the strip, from the rendered chip's width.
  useLayoutEffect(() => {
    const element = strip.current
    if (!element) return
    const measure = () => {
      const chip = element.querySelector<HTMLElement>('.slide-index-chip:not(.slide-index-gap)')
      if (!chip) return
      const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 0
      const chipWidth = chip.getBoundingClientRect().width
      if (chipWidth <= 0 || element.clientWidth <= 0) return
      const fit = Math.max(1, Math.floor((element.clientWidth + gap) / (chipWidth + gap)))
      setSlots((shown) => (shown === fit ? shown : fit))
    }
    return observeResize([element], measure)
  }, [])

  // The slide a key pressed in the strip left from. Whichever key moves the
  // deck (the arrows here, or n, p, Home, End heard by the deck), focus goes
  // with it to the new current page, until focus is taken out of the strip.
  const keyedFrom = useRef<number | null>(null)

  // The destination chip may not be mounted until the window re-renders.
  useEffect(() => {
    const follows = keyedFrom.current !== null && keyedFrom.current !== slide
    if (pendingFocus.current !== slide && !follows) return
    const chip = chips.current[slide - 1]
    if (!chip) return
    pendingFocus.current = null
    keyedFrom.current = null
    chip.focus()
  }, [slide, slots])

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!plainKey(event)) return
    keyedFrom.current = slide
    // Arrows inside the strip move between pages. The deck's own arrow
    // handling must not also fire for the same keystroke.
    const key = keyName(event)
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') return
    event.stopPropagation()
    event.preventDefault()
    const target = Math.min(Math.max(slide + (key === 'ArrowLeft' ? -1 : 1), 1), total)
    if (target !== slide) onSelect(target)
  }

  // Focus taken somewhere else ends the following. A page leaving the window
  // drops focus to nowhere (no related target), which does not.
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (event.relatedTarget && !strip.current?.contains(event.relatedTarget)) keyedFrom.current = null
  }

  return (
    <div ref={strip} className="slide-index-strip" role="group" aria-label="Go to slide" onKeyDown={onKeyDown} onBlur={onBlur}>
      {entries.map((entry) =>
        entry.kind === 'gap' ? (
          <span key={`gap-${entry.from}`} className="slide-index-chip slide-index-gap" aria-hidden="true">
            …
          </span>
        ) : (
          <PageChip
            key={slides[entry.number - 1].id}
            ref={(element) => {
              chips.current[entry.number - 1] = element
            }}
            current={entry.number === slide}
            tabIndex={entry.number === slide ? 0 : -1}
            aria-label={slideLabel(entry.number, slides[entry.number - 1].heading, entry.number === slide ? current?.note : '')}
            onClick={() => onSelect(entry.number)}
          >
            {entry.number === slide && current ? current.label : entry.number}
          </PageChip>
        ),
      )}
    </div>
  )
}
