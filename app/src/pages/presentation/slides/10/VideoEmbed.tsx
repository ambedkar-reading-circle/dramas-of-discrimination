import TabletVideoFrame from '#/components/TabletVideoFrame'
import SlideAssetPlaceholder from '../../components/SlideAssetPlaceholder'

export function VideoEmbed() {
  return (
    <div className="presentation-embed presentation-video">
      <TabletVideoFrame className="presentation-tablet-frame" />
      <SlideAssetPlaceholder role="video" note="A second clip, from a Rehearsal" />
    </div>
  )
}
