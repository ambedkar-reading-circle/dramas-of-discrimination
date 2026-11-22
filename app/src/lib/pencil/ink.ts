import { parseColorChannels } from '#/lib/parseColor.ts'
import type { Ink, InkResolver, Point } from './types.ts'
import { toViewport } from './viewport.ts'

const DEFAULT_INK: Ink = { r: 19, g: 24, b: 87 }

let colorProbe: HTMLSpanElement | null = null

function readInk(color: string): Ink | null {
  const direct = parseColorChannels(color)
  if (direct) return direct
  const specified = color.trim()
  if (!specified) return null
  if (!colorProbe) {
    colorProbe = document.createElement('span')
    colorProbe.hidden = true
    document.documentElement.append(colorProbe)
  }
  colorProbe.style.color = specified
  return parseColorChannels(getComputedStyle(colorProbe).color)
}

function isPointInSelection(x: number, y: number): boolean {
  const selection = document.getSelection()
  if (!selection || selection.isCollapsed || selection.rangeCount === 0)
    return false
  for (let index = 0; index < selection.rangeCount; index += 1) {
    const rects = selection.getRangeAt(index).getClientRects()
    for (const rect of rects) {
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      )
        return true
    }
  }
  return false
}

export function createInkResolver(fallback: Ink = DEFAULT_INK): InkResolver {
  return (point: Point): Ink => {
    const { x, y } = toViewport(point)
    const element = document.elementFromPoint(x, y)
    if (!element) return fallback
    const style = getComputedStyle(element)
    if (isPointInSelection(x, y)) {
      const selectionInk = readInk(style.getPropertyValue('--hl-text'))
      if (selectionInk) return selectionInk
    }
    return readInk(style.color) ?? fallback
  }
}
