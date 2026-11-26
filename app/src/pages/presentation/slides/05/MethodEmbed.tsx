import { useState } from 'react'
import { MethodCollection } from '#/pages/home/workshop-method'
import { useCueTarget } from '../../playback/targets'

declare module '../../playback/cues' {
  interface CueTargets {
    /** Slide 05: the act lifted out of the fan, by its index. */
    method: number | null
  }
}

export function MethodEmbed() {
  // Each act's notes lift that act out of the fan while they play.
  const [highlight, setHighlight] = useState<number | null>(null)
  useCueTarget('method', setHighlight, { rest: null })

  return (
    <div className="presentation-embed presentation-method">
      <MethodCollection hint={false} highlight={highlight} />
    </div>
  )
}
