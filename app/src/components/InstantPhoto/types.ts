import type { RevealControls } from '#/components/Reveal'

export type Direction = 'left' | 'right' | 'bottom'

export interface InstantPhotoData {
  src: string
  alt: string
  caption?: string
  href?: string
  direction: Direction
  tilt?: number
}

export interface InstantPhotoProps extends InstantPhotoData {
  controls: RevealControls
}
