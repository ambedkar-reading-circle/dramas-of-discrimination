import { InstantPhotoLayer } from '#/components/InstantPhoto'
import { useReveal } from '#/components/Reveal'
import { useSlideStageHost } from '../../hooks/useSlideStageHost'
import { useRevealCue } from '../../playback/useSlideCue'
import { CircleCard } from './CircleCard'
import { CircleGroup } from './CircleGroup'
import { PhoneLayer } from './PhoneLayer'
import { circles, circlesLabel, findByKey, values, valuesLabel } from './content/circles'
import type { BoardKey } from './content/circles'
import './CircleBoard.css'

const boardKeys: ReadonlyArray<BoardKey> = [...values, ...circles].map((item) => item.key)

export function CircleBoard() {
  const host = useSlideStageHost()
  const reveal = useReveal<BoardKey>()
  useRevealCue(reveal, boardKeys)

  return (
    <div className="circle-board">
      <InstantPhotoLayer host={host} photo={findByKey(values, reveal.active)?.photo ?? null} controls={reveal} />
      <PhoneLayer host={host} circle={findByKey(circles, reveal.active)} />
      <CircleGroup label={valuesLabel} className="circle-values">
        {values.map((value, index) => (
          <CircleCard key={value.key} item={value} label={`${value.name}: show the photo`} order={index} reveal={reveal} />
        ))}
      </CircleGroup>
      <CircleGroup label={circlesLabel} className="circle-list">
        {circles.map((circle, index) => (
          <CircleCard key={circle.key} item={circle} label={`${circle.name} on Instagram`} order={values.length + index} reveal={reveal} />
        ))}
      </CircleGroup>
    </div>
  )
}
