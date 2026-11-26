/**
 * The grammar of a slide cue, in one place: what `beats.ts` writes into a
 * beat and what slides read back out of it. A cue is `<verb>` or
 * `<verb>:<arg>`, such as `reveal:systems`, `tab:1` or `generate`.
 */

/** The verbs a cue can start with. A marker with any other verb is a typo in the notes. */
export const cueVerbs = ['reveal', 'tab', 'guide', 'video', 'generate', 'edit'] as const
export type CueVerb = (typeof cueVerbs)[number]

/** A cue split into its verb and its argument: `reveal:systems` is `{ verb: 'reveal', arg: 'systems' }`. */
export type ParsedCue = Readonly<{ verb: CueVerb; arg: string }>

const warned = new Set<string>()

/**
 * Flags a cue the slide cannot act on, so a typo in the notes shows in
 * development instead of doing nothing. Once per cue, however many handlers
 * read it or however often it replays.
 */
export function warnCue(cue: string, why: string) {
  if (!import.meta.env.DEV || warned.has(cue)) return
  warned.add(cue)
  console.warn(`Slide cue "${cue}" ignored: ${why}`)
}

function isCueVerb(verb: string): verb is CueVerb {
  return (cueVerbs as ReadonlyArray<string>).includes(verb)
}

/** Splits a cue such as `reveal:systems` into its verb and its argument; null for no cue or an unknown verb. */
export function parseCue(cue: string | null): ParsedCue | null {
  if (!cue) return null
  const at = cue.indexOf(':')
  const verb = at < 0 ? cue : cue.slice(0, at)
  if (!isCueVerb(verb)) {
    warnCue(cue, `unknown verb; expected one of ${cueVerbs.join(', ')}`)
    return null
  }
  return { verb, arg: at < 0 ? '' : cue.slice(at + 1) }
}

/** The verb of a cue, or null for no cue or an unknown verb. */
export function verbOf(cue: string | null): CueVerb | null {
  return parseCue(cue)?.verb ?? null
}

/** The cue a speaker-note tab plays its points under. */
export function tabCue(index: number): string {
  return `tab:${index}`
}

/** Whether a cue names a speaker-note tab. Quiet about other verbs, unlike `parseCue`. */
export function isTabCue(cue: string | null): boolean {
  return cue?.startsWith('tab:') === true
}

/** The tab index a `tab:<n>` cue names, or null. */
export function tabOf(cue: string | null): number | null {
  const parsed = parseCue(cue)
  if (parsed?.verb !== 'tab') return null
  const index = Number(parsed.arg)
  if (Number.isInteger(index)) return index
  if (cue) warnCue(cue, 'the tab is not a whole number')
  return null
}
