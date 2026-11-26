import type { Caption, Point } from './points'
import recordings from './narration.json'
import { speech } from './speech'

/**
 * What sets how long the caption on screen lasts, and what plays it:
 *
 * - `read`: a timer, for the reading time of a line (or a cue's short hold).
 * - `recording`: a recorded reading of the caption, of known length.
 * - `browser-voice`: the browser's speech engine, which sets its own pace.
 * - `film`: the slide's film, which reports its end through `resolveWait`.
 */
export type Pace =
  | Readonly<{ kind: 'read'; ms: number }>
  | Readonly<{ kind: 'recording'; src: string; ms: number }>
  | Readonly<{ kind: 'browser-voice'; text: string; holdMs: number }>
  | Readonly<{ kind: 'film' }>

/** Recorded captions, by caption id, with each recording's length. Meant to be written by a narration script (not built yet), not by hand. */
const recorded: Readonly<Partial<Record<string, number>>> = recordings

/** Where a caption's recording is served from. */
const recordingSrc = (id: string) => `/narration/${id}.mp3`

/** A short breath after a reading ends, before the next caption. */
const afterReadingMs = 400

/**
 * How the caption is paced. With the voice on, a recorded caption plays its
 * recording, and any other falls back to the browser's voice. A cue's
 * caption says nothing, so it keeps its short hold either way.
 */
export function paceOf(caption: Caption, point: Point, voice: boolean): Pace {
  if (point.wait !== undefined) return { kind: 'film' }
  if (!voice || caption.speak === '')
    return { kind: 'read', ms: caption.holdMs }
  const ms = recorded[caption.id]
  if (ms !== undefined)
    return { kind: 'recording', src: recordingSrc(caption.id), ms }
  if (speech())
    return {
      kind: 'browser-voice',
      text: caption.speak,
      holdMs: caption.holdMs,
    }
  return { kind: 'read', ms: caption.holdMs }
}

/** How long the pace runs, when that is known ahead: the time the deck's lines run across. */
export function knownMs(pace: Pace): number | null {
  return pace.kind === 'read' || pace.kind === 'recording' ? pace.ms : null
}

/**
 * Runs the pace, and calls `onEnd` once when the caption is done. Returns
 * the cleanup, which stops it early: timers cleared, reading silenced.
 */
export function runPace(pace: Pace, onEnd: () => void): () => void {
  let done = false
  const timers: Array<ReturnType<typeof setTimeout>> = []
  const later = (ms: number) =>
    timers.push(
      setTimeout(() => {
        if (done) return
        done = true
        onEnd()
      }, ms),
    )
  const clearTimers = () => timers.forEach(clearTimeout)

  switch (pace.kind) {
    case 'film':
      return () => {}

    case 'read':
      later(pace.ms)
      return clearTimers

    case 'browser-voice': {
      const synth = speech()
      if (!synth) {
        later(pace.holdMs)
        return clearTimers
      }
      synth.cancel()
      const utterance = new SpeechSynthesisUtterance(pace.text)
      utterance.lang = 'en-IN'
      utterance.onend = () => later(afterReadingMs)
      synth.speak(utterance)
      // A voice that never reports its end must not stall the deck.
      later(pace.holdMs * 3)
      return () => {
        clearTimers()
        utterance.onend = null
        synth.cancel()
      }
    }

    case 'recording': {
      const audio = new Audio(pace.src)
      audio.onended = () => later(afterReadingMs)
      // A recording the browser will not play (blocked, or missing) still holds its length, silently.
      audio.play().catch(() => later(pace.ms))
      // A recording that stalls must not stall the deck.
      later(pace.ms * 2 + 1000)
      return () => {
        clearTimers()
        audio.onended = null
        audio.pause()
        audio.removeAttribute('src')
        audio.load()
      }
    }
  }
}
