import { use, useEffect, useLayoutEffect, useRef } from 'react'
import type { Reveal } from '#/components/Reveal'
import { parseCue, tabOf, warnCue } from './cues'
import { SlideIdContext, usePlayback } from './playback'

/**
 * Runs `handler` with the current beat's cue each time playback applies a
 * beat to this slide. A beat without a cue passes
 * `null`, so a slide can close what the last beat opened. Handlers for
 * modes and tabs can ignore `null` and keep the Room's last choice. Outside
 * the deck, before play is pressed, or when someone moves the paused deck by
 * hand, it does nothing, and the slide is driven by hand as before.
 */
export function useSlideCue(handler: (cue: string | null) => void) {
  const playback = usePlayback()
  const slideId = use(SlideIdContext)
  const latest = useRef(handler)
  useLayoutEffect(() => {
    latest.current = handler
  })
  const active = playback?.selfMode === true && playback.byPlayback && slideId !== null && slideId === playback.slideId
  const token = active ? playback.token : 0
  const cue = active ? playback.current.cue : null
  const fresh = active && playback.cueChanged
  // Leaving the slide passes a last `null`, so whatever the beats opened is put away.
  const applied = useRef(false)
  useEffect(() => {
    if (token) {
      applied.current = true
      if (fresh) latest.current(cue)
    } else if (applied.current) {
      applied.current = false
      latest.current(null)
    }
  }, [token, cue, fresh])
}

/**
 * Opens the reveal a `reveal:<key>` cue names, and closes it for any other
 * beat. A key the slide does not have is flagged rather than opened.
 */
export function useRevealCue<TKey extends string>(reveal: Reveal<TKey>, keys: ReadonlyArray<TKey>) {
  useSlideCue((cue) => {
    const parsed = parseCue(cue)
    if (parsed?.verb !== 'reveal') return reveal.close()
    const key = keys.find((candidate) => candidate === parsed.arg)
    if (key === undefined) {
      if (cue) warnCue(cue, `no such reveal; expected one of ${keys.join(', ')}`)
      return reveal.close()
    }
    reveal.open(key)
  })
}

/**
 * Runs `onTab` with the speaker-note tab a `tab:<n>` cue names, so a slide
 * shows the part its notes are on. Other beats leave the slide as the Room
 * last set it.
 */
export function useTabCue(onTab: (tab: number) => void) {
  useSlideCue((cue) => {
    const tab = tabOf(cue)
    if (tab !== null) onTab(tab)
  })
}
