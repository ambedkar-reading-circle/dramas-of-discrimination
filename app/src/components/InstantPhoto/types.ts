import type { RefObject } from 'react'

export type Direction = 'left' | 'right' | 'bottom'

export interface InstantPhotoData {
  src: string
  /** Describes the photo itself; the caption is read separately. */
  alt: string
  caption?: string
  direction: Direction
  tilt?: number
}

/** What a shown photo can do to the reveal that opened it. */
export interface PhotoControls {
  close: () => void
}

export interface PhotoReveal<TKey> extends PhotoControls {
  active: TKey | null
  open: (key: TKey) => void
  isOpen: (key: TKey) => boolean
  /** Opens this key's photo, or puts it back if it is the one showing. */
  toggle: (key: TKey) => void
}

export interface InstantPhotoProps extends InstantPhotoData {
  bounds?: RefObject<HTMLElement | null>
  controls: PhotoControls
}
