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
  keep: () => void
  close: () => void
  startDrag: () => void
  endDrag: () => void
}

export interface PhotoReveal<TKey> extends PhotoControls {
  active: TKey | null
  open: (key: TKey) => void
  isOpen: (key: TKey) => boolean
  /** Closes the photo if it was open when the press began, otherwise opens it. */
  toggle: (key: TKey, wasOpen: boolean) => void
}

export interface InstantPhotoProps extends InstantPhotoData {
  bounds?: RefObject<HTMLElement | null>
  controls: PhotoControls
}
