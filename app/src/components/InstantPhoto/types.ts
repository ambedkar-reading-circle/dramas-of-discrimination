import type { RevealControls } from '#/components/Reveal'

export type Direction = 'left' | 'right' | 'bottom'

export interface InstantPhotoData {
  src: string
  alt: string
  caption?: string
  /** Where the caption links to, such as the article a clipping is cut from. Opens in a new tab. */
  href?: string
  direction: Direction
  tilt?: number
}

export interface InstantPhotoProps extends InstantPhotoData {
  controls: RevealControls
}
