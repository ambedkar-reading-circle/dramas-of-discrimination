import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import MarkButton from '#/components/MarkButton'
import CaretsToAxisHorizontal from './CaretsToAxisHorizontal'
import { scrollPageTo } from '#/components/SmoothScroll'
import './FitSectionButton.css'

export const viewportSection = { 'data-viewport-section': '' } as const

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

function fittedScroll(section: HTMLElement) {
  const rect = section.getBoundingClientRect()
  if (rect.height > 1.5 * window.innerHeight) {
    if (rect.top > 0) return window.scrollY + rect.top
    if (rect.bottom < window.innerHeight) return window.scrollY + rect.bottom - window.innerHeight
    return null
  }
  const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  return window.scrollY + rect.top - margin - padding
}

export function fitSectionInView(section: HTMLElement) {
  const y = fittedScroll(section)
  if (y != null && Math.abs(y - window.scrollY) > 1) scrollPageTo(y)
}

export default function FitSectionButton() {
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
