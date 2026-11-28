import { useLayoutEffect, useReducer, useRef, useState } from 'react'

/** Room kept between the generating stream and the page's edge, in the charter's own pixels. */
const followMargin = 24

/** Slack in pixels before the page counts as having more above or below, against sub-pixel scroll positions. */
const edgeSlack = 2

/** Where the draft is being written: the stream the page follows while it generates. */
const streamSelector = '.mani-stream'

export type CharterOverflow = Readonly<{ above: boolean; below: boolean }>

/**
 * The charter's scrolling page: whether there is more of it above or below,
 * and, while `follow` is on, keeping the generating stream in view.
 * Attach `page` to the scrolling element and `onScroll` to its scroll event.
 */
export function useCharterScroll(follow: boolean) {
  const page = useRef<HTMLDivElement>(null)
  // A scroll changes what lies above and below, so the page measures again.
  const [, onScroll] = useReducer((count: number) => count + 1, 0)
  const [overflow, setOverflow] = useState<CharterOverflow>({ above: false, below: false })

  // After every render and scroll: is there more of the page above or below?
  useLayoutEffect(() => {
    const element = page.current
    if (!element) return
    const above = element.scrollTop > edgeSlack
    const below = element.scrollTop + element.clientHeight < element.scrollHeight - edgeSlack
    setOverflow((current) => (current.above === above && current.below === below ? current : { above, below }))
  })

  useLayoutEffect(() => {
    const element = page.current
    const stream = element?.querySelector(streamSelector)
    if (!follow || !element || !stream) return
    // The slide may be scaled to fit, so client rectangles are brought back to the page's own pixels.
    const box = element.getBoundingClientRect()
    const scale = box.height / element.offsetHeight || 1
    const at = stream.getBoundingClientRect()
    const below = (at.bottom - box.bottom) / scale + followMargin
    const above = (at.top - box.top) / scale - followMargin
    if (below > 0) element.scrollTop += below
    else if (above < 0) element.scrollTop += above
  })

  /** Scrolls the page down by most of its own height. */
  const scrollOn = () => page.current?.scrollBy({ top: page.current.clientHeight * 0.7, behavior: 'smooth' })

  return { page, overflow, onScroll, scrollOn }
}
