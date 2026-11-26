import { InstantPhotoLayer } from '#/components/InstantPhoto'
import { useReveal } from '#/components/Reveal'
import { useSlideStageHost } from '../../hooks/useSlideStageHost'
import { useRevealCue } from '../../playback/useSlideCue'
import ApproachReveal from './components/approach/ApproachReveal'
import TitleWordmark from './components/TitleWordmark'
import { approachPhotos } from './content/approachPhotos'
import { subtitle } from './content/titleCopy'
import { ApproachRevealContext } from './hooks/useApproachReveal'
import type { ApproachSide } from './types'

const approachSides = Object.keys(approachPhotos) as ReadonlyArray<ApproachSide>

export function TitleSlideBody() {
  const host = useSlideStageHost()
  const reveal = useReveal<ApproachSide>()
  useRevealCue(reveal, approachSides)

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
