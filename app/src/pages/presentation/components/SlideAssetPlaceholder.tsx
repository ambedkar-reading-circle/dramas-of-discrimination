import type { AssetSlot } from '../types'

const roleLabels: Record<AssetSlot['role'], string> = {
  image: 'Image',
  video: 'Video',
  document: 'Document',
}

/**
 * The stand-in for an asset the project has not procured yet. The framed box is
 * deliberate decoration (aria-hidden); the caption is the text label. Swapping
 * in a real asset replaces this slot without any layout change.
 */
export default function SlideAssetPlaceholder({ role, note }: AssetSlot) {
  return (
    <figure className={`slide-asset slide-asset--${role}`}>
      <div className="slide-asset-placeholder" aria-hidden="true">
        <span className="slide-asset-role">{roleLabels[role]}</span>
      </div>
      <figcaption className="slide-asset-caption">
        <span>
          {roleLabels[role]} slot
          {note ? ' — ' : ''}
          {note ?? ''}
        </span>
      </figcaption>
    </figure>
  )
}
