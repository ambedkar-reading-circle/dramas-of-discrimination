import { useRef } from 'react'
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
  const layer = useRef<HTMLDivElement>(null)
  if (!host) return null
  return createPortal(
    <div ref={layer} className="instant-photo-layer">
      <AnimatePresence>{photo && <InstantPhoto key={photo.src} {...photo} bounds={layer} controls={controls} />}</AnimatePresence>
    </div>,
    host,
  )
}
