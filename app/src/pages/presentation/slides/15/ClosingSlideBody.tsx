import ArcLink from '#/components/ArcLink'
import { manualEmail } from '#/pages/home/manual-flipbook'

export function ClosingSlideBody() {
  return (
    <div className="slide-closing rise-in">
      <p className="slide-closing-lede">Bring the Workshop to your Community.</p>
      <p>
        <ArcLink>Ambedkar Reading Circle</ArcLink>
        <span aria-hidden="true"> · </span>
        <a href={`mailto:${manualEmail}`}>{manualEmail}</a>
      </p>
    </div>
  )
}
