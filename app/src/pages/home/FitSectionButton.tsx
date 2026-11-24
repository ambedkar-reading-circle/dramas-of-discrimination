import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import MarkButton from '#/components/MarkButton'
import CaretsToAxisHorizontal from './CaretsToAxisHorizontal'
import { scrollPageTo } from '#/components/SmoothScroll'
import './FitSectionButton.css'

/** Sections opt in with this attribute; each is sized to one viewport. */
export const viewportSection = { 'data-viewport-section': '' } as const

/** The section that currently covers the most of the viewport. */
function currentSection() {
  let best: HTMLElement | null = null
  let bestVisible = 0
  for (const section of document.querySelectorAll<HTMLElement>('[data-viewport-section]')) {
    const rect = section.getBoundingClientRect()
    const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
    if (visible > bestVisible) {
      best = section
      bestVisible = visible
    }
  }
  return best
}

/** Window Y that seats the section in the viewport, or null when it already is. */
function fittedScroll(section: HTMLElement) {
  const rect = section.getBoundingClientRect()
  // A scroll runway (the manual) pins its own viewport-sized stage, so it is
  // seated whenever it covers the whole screen; otherwise bring in its near edge.
  if (rect.height > 1.5 * window.innerHeight) {
    if (rect.top > 0) return window.scrollY + rect.top
    if (rect.bottom < window.innerHeight) return window.scrollY + rect.bottom - window.innerHeight
    return null
  }
  // Match native anchor alignment: the section's margin and the header padding.
  const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  return window.scrollY + rect.top - margin - padding
}

/** Scroll so the section sits exactly in the viewport. */
export function fitSectionInView(section: HTMLElement) {
  const y = fittedScroll(section)
  if (y != null && Math.abs(y - window.scrollY) > 1) scrollPageTo(y)
}

export default function FitSectionButton() {
  // Portal to <body>: inside <main>'s stacking context the footer would cover it.
  // Mount first so server rendering never touches `document`.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const fit = () => {
    const section = currentSection()
    if (section) fitSectionInView(section)
  }

  if (!mounted) return null
  return createPortal(
    <MarkButton className="fit-section-button" label="Fit this section to the screen" title="Fit this section to the screen" onClick={fit} mark={<CaretsToAxisHorizontal absoluteStrokeWidth strokeWidth={1.25} />} />,
    document.body,
  )
}
