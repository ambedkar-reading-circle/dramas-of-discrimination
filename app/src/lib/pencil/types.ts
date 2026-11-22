export interface Point {
  x: number
  y: number
  time: number
}

export interface Ink {
  r: number
  g: number
  b: number
}

export type InkResolver = (point: Point) => Ink

export interface PencilOptions {
  minWidth: number
  maxWidth: number
  alpha: number
  fastSpeed: number
  fadeMs: number
  inkIntervalMs: number
}

export interface PointerTraceListener {
  begin: (point: Point) => void
  extend: (points: Point[]) => void
  end: () => void
}

export interface TrailRenderer extends PointerTraceListener {
  clear: () => void
  dispose: () => void
}

export interface PointerTrace {
  subscribe: (listener: PointerTraceListener) => () => void
}
