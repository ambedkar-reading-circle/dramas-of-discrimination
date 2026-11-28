export interface CueTargets {}

export type CueTarget = keyof CueTargets

export type Cue = { [K in CueTarget]: Readonly<{ set: K; to: CueTargets[K]; wait?: 'film' }> }[CueTarget]

export type CueState = Readonly<Partial<CueTargets>>

export function cuesOf<TTarget extends CueTarget>(set: TTarget) {
  return (to: CueTargets[TTarget]): Readonly<{ set: TTarget; to: CueTargets[TTarget] }> => ({ set, to })
}

const warned = new Set<string>()

export function warnCue(cue: Cue, why: string) {
  const name = JSON.stringify(cue)
  if (!import.meta.env.DEV || warned.has(name)) return
  warned.add(name)
  console.warn(`Slide cue ${name} ignored: ${why}`)
}
