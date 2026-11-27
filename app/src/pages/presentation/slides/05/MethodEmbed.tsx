import { useState } from 'react'
import { useIsPresent } from 'motion/react'
import { MethodCollection, workshopActivities } from '#/pages/home/workshop-method'
import type { ActivityName, OverlayKind, SheetView } from '#/pages/home/workshop-method'
import { useCueTarget } from '../../playback/targets'

/**
 * What slide 05 shows, as its speaker notes write it:
 *
 *     'PartTime'                          the act lifted out of the fan
 *     { open: 'PartTime' }                its sheet open
 *     { open: 'PartTime', photo: 2 }      step 2's photographs laid over it
 *     { open: 'PartTime', manual: 1 }     its first excerpt of the manual
 *     { open: 'PartTime', worksheet: 2 }  its second worksheet sticker
 *
 * Stickers count from 1, as the sheet numbers its steps. Write `open` first:
 * the deck matches a sticker opened by hand to its cue by its JSON.
 */
export type MethodCue =
  | ActivityName
  | Readonly<{ open: ActivityName } & { [K in OverlayKind]?: number }>
  | null

declare module '../../playback/cues' {
  interface CueTargets {
    /** Slide 05: an act lifted out of the fan, or its sheet open. */
    method: MethodCue
  }
}

const actOf = (name: ActivityName) => workshopActivities.findIndex((activity) => activity.name === name)
const kinds: ReadonlyArray<OverlayKind> = ['photo', 'manual', 'worksheet']

/** The sheet a cue opens, if it opens one. */
function viewOf(cue: MethodCue): SheetView | null {
  if (cue === null || typeof cue === 'string') return null
  const kind = kinds.find((k) => cue[k] !== undefined)
  return { act: actOf(cue.open), show: kind === undefined ? null : { kind, index: (cue[kind] ?? 1) - 1 } }
}

/** The cue that shows a sheet opened by hand, written as the notes write it. */
function cueOf(view: SheetView): MethodCue {
  const open = workshopActivities[view.act].name
  return view.show === null ? { open } : { open, [view.show.kind]: view.show.index + 1 }
}

export function MethodEmbed() {
  // The notes lift each act out of the fan, then open its sheet and lay its
  // photographs, manual pages and worksheets over it in turn.
  const [shown, setShown] = useState<MethodCue>(null)
  // What the deck follows: the last thing opened, by a cue or by hand. Opening
  // a sheet or a sticker by hand moves the deck to the point that shows it;
  // putting one away stays a change by hand, so the deck does not jump back.
  const [opened, setOpened] = useState<MethodCue>(null)
  const cue = (value: MethodCue) => {
    setShown(value)
    setOpened(value)
  }
  useCueTarget('method', cue, { rest: null, value: opened })

  const view = viewOf(shown)
  const change = (next: SheetView | null) => {
    const closing = next === null || (next.show === null && view?.act === next.act && view.show !== null)
    if (closing) setShown(next === null ? null : cueOf(next))
    else cue(cueOf(next))
  }

  // The sheet sits in the top layer, over every slide: it goes as soon as this slide starts to leave.
  const present = useIsPresent()
  const highlight = typeof shown === 'string' ? actOf(shown) : null

  return (
    <div className="presentation-embed presentation-method">
      <MethodCollection hint={false} highlight={highlight} view={present ? view : null} onViewChange={change} modeless />
    </div>
  )
}
