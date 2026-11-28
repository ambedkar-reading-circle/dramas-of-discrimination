import { useRef } from 'react'
import TabletVideoFrame from '#/components/TabletVideoFrame'
import { TabletSwing } from '../shared/TabletSwing'
import { useFilmCue } from './useFilmCue'

export function VideoEmbed() {
  const film = useRef<HTMLIFrameElement>(null)
  useFilmCue(film)
  return (
    <TabletSwing className="presentation-video">
      <TabletVideoFrame ref={film} />
    </TabletSwing>
  )
}
