import { useState } from 'react'
import { MethodCollection } from '#/pages/home/workshop-method'
import { tabOf } from '../../playback/cues'
import { useSlideCue } from '../../playback/useSlideCue'

export function MethodEmbed() {
  // Each act's notes lift that act out of the fan while they play.
  const [highlight, setHighlight] = useState<number | null>(null)
  useSlideCue((cue) => setHighlight(tabOf(cue)))

  return (
    <div className="presentation-embed presentation-method">
      <MethodCollection hint={false} highlight={highlight} />
    </div>
  )
}
