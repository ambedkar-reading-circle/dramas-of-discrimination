import { RevealLayer } from '#/components/Reveal'
import type { RevealControls } from '#/components/Reveal'
import InstantPhoto from './InstantPhoto'
import type { InstantPhotoData } from './types'

interface InstantPhotoLayerProps {
  host: HTMLElement | null
  photo: InstantPhotoData | null
  controls: RevealControls
}

export default function InstantPhotoLayer({ host, photo, controls }: InstantPhotoLayerProps) {
  return <RevealLayer host={host}>{photo && <InstantPhoto key={photo.src} {...photo} controls={controls} />}</RevealLayer>
}
