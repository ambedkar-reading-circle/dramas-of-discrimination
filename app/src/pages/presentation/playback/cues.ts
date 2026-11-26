/**
 * Slide cues: a cue sets one of the slide's named targets to a value, such
 * as `{ set: 'approach', to: 'forum' }`. Speaker notes carry them between
 * their lines; slides read the targets with `useCueTarget`.
 */

/**
 * Every cue target, with the values it takes. Each slide adds its own by
 * module augmentation, next to the component that reads it:
 *
 *     declare module '../../playback/cues' {
 *       interface CueTargets { approach: ApproachSide | null }
 *     }
 */
export interface CueTargets {}

export type CueTarget = keyof CueTargets

/**
 * Sets one target to a value, from its point on until another cue sets it.
 * `wait: 'video'` holds its point until the film ends, and sets the target
 * for that point only.
 */
/** What a cue's point can wait on before the deck moves on. */
export type CueWait = 'video'

export type Cue = { [K in CueTarget]: Readonly<{ set: K; to: CueTargets[K]; wait?: CueWait }> }[CueTarget]

/** Every target a cue has set by some point of a slide, and the value it holds there. */
export type CueState = Readonly<Partial<CueTargets>>

const warned = new Set<string>()

/**
 * Flags a cue the slide cannot act on, so a mistake in the notes shows in
 * development instead of doing nothing. Once per cue, however often it replays.
 */
export function warnCue(cue: Cue, why: string) {
  const name = JSON.stringify(cue)
  if (!import.meta.env.DEV || warned.has(name)) return
  warned.add(name)
  console.warn(`Slide cue ${name} ignored: ${why}`)
}
