import { InstantPhotoLayer, usePhotoReveal } from '#/components/InstantPhoto'
import { useSlideStageHost } from '../../hooks/useSlideStageHost'
import ApproachReveal from './components/approach/ApproachReveal'
import TitleWordmark from './components/TitleWordmark'
import { approachPhotos } from './content/approachPhotos'
import { subtitle } from './content/titleCopy'
import { ApproachRevealContext } from './hooks/useApproachReveal'
import type { ApproachSide } from './types'

export function TitleSlideBody() {
  const host = useSlideStageHost()
  const reveal = usePhotoReveal<ApproachSide>()

  return (
    <ApproachRevealContext value={reveal}>
      <div className="rise-in grid justify-items-center gap-row">
        <InstantPhotoLayer host={host} photo={reveal.active && approachPhotos[reveal.active]} controls={reveal} />
        <TitleWordmark />
        <p className="max-w-[48ch] text-[1.25rem]">{subtitle}</p>
        <ApproachReveal />
      </div>
    </ApproachRevealContext>
  )
}
