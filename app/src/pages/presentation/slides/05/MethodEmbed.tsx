import { useState } from 'react'
import { useIsPresent } from 'motion/react'
import { MethodCollection, workshopActivities } from '#/pages/home/workshop-method'
import type { ActivityName, OverlayKind, SheetView } from '#/pages/home/workshop-method'
import { useCueTarget } from '../../playback/targets'

export type MethodCue =
  | ActivityName
  | Readonly<{ open: ActivityName } & { [K in OverlayKind]?: number }>
  | null

declare module '../../playback/cues' {
  interface CueTargets {
    method: MethodCue
  }
}

const actOf = (name: ActivityName) => workshopActivities.findIndex((activity) => activity.name === name)
const kinds: ReadonlyArray<OverlayKind> = ['photo', 'manual', 'worksheet']

function viewOf(cue: MethodCue): SheetView | null {
  if (cue === null || typeof cue === 'string') return null
  const kind = kinds.find((k) => cue[k] !== undefined)
  return { act: actOf(cue.open), show: kind === undefined ? null : { kind, index: (cue[kind] ?? 1) - 1 } }
}

function cueOf(view: SheetView): MethodCue {
  const open = workshopActivities[view.act].name
  return view.show === null ? { open } : { open, [view.show.kind]: view.show.index + 1 }
}

export function MethodEmbed() {
  const [shown, setShown] = useState<MethodCue>(null)
  const [followed, setFollowed] = useState<MethodCue>(null)
  const showAndFollow = (value: MethodCue) => {
    setShown(value)
    setFollowed(value)
  }
  useCueTarget('method', showAndFollow, { rest: null, value: followed })

  const view = viewOf(shown)
  const change = (next: SheetView | null) => {
    const closing = next === null || (next.show === null && view?.act === next.act && view.show !== null)
    if (closing) setShown(next === null ? null : cueOf(next))
    else showAndFollow(cueOf(next))
  }

  const present = useIsPresent()
  const highlight = typeof shown === 'string' ? actOf(shown) : null

  return (
    <div className="presentation-embed presentation-method">
      <MethodCollection hint={false} highlight={highlight} view={present ? view : null} onViewChange={change} modeless />
    </div>
  )
}
