import type { Point } from './types.ts'

export function toViewport(point: Point): { x: number; y: number } {
  return { x: point.x - window.scrollX, y: point.y - window.scrollY }
}
