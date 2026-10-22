// Adapted from rough-notation — © Preet Shihn / rough-stuff (MIT)
// https://github.com/rough-stuff/rough-notation
// Clean-room re-implementation of its annotation model for this repo.

export const SVG_NS = 'http://www.w3.org/2000/svg'

export const DEFAULT_ANIMATION_DURATION = 800
export const DEFAULT_HIDE_DURATION_RATIO = 0.4

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export type RoughAnnotationType =
  | 'underline'
  | 'box'
  | 'circle'
  | 'highlight'
  | 'strike-through'
  | 'crossed-off'
  | 'bracket'

export type FullPadding = [number, number, number, number]
export type RoughPadding = number | [number, number] | FullPadding

export type BracketType = 'left' | 'right' | 'top' | 'bottom'

export interface RoughAnnotationConfigBase {
  animate?: boolean // defaults to true
  animationDuration?: number // defaults to 800ms
  hideDuration?: number // retract duration, defaults to ~40% of animationDuration
  color?: string // defaults to currentColor
  strokeWidth?: number // defaults to 2 (type-dependent)
  padding?: RoughPadding // defaults to 5px
  iterations?: number // defaults to 2
  brackets?: BracketType | BracketType[] // defaults to 'right'
}

export interface RoughAnnotationConfig extends RoughAnnotationConfigBase {
  type: RoughAnnotationType
  multiline?: boolean
  rtl?: boolean
}

export interface RoughAnnotation extends RoughAnnotationConfigBase {
  isShowing: () => boolean
  show: () => void
  hide: () => void
  remove: () => void
}
