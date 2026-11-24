import { createPortal } from 'react-dom'
import { AnimatePresence } from 'motion/react'
import InstantPhoto from './InstantPhoto'
import type { InstantPhotoData, PhotoControls } from './types'

interface InstantPhotoLayerProps {
  host: HTMLElement | null
  photo: InstantPhotoData | null
  controls: PhotoControls
}

export default function InstantPhotoLayer({ host, photo, controls }: InstantPhotoLayerProps) {
  if (!host) return null
  return createPortal(
    <div className="instant-photo-layer">
      <AnimatePresence>{photo && <InstantPhoto key={photo.src} {...photo} controls={controls} />}</AnimatePresence>
    </div>,
    host,
  )
}
