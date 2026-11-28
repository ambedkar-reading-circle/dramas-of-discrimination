import type { Caption, Point } from './points'
import { speech } from './speech'

export type Pace =
  | Readonly<{ kind: 'read'; ms: number }>
  | Readonly<{ kind: 'browser-voice'; text: string; holdMs: number }>
  | Readonly<{ kind: 'film' }>

const afterReadingMs = 400

export function paceOf(caption: Caption, point: Point, voice: boolean): Pace {
  if (point.wait !== undefined) return { kind: 'film' }
  if (!voice || caption.speak === '')
    return { kind: 'read', ms: caption.holdMs }
  if (speech())
    return {
      kind: 'browser-voice',
      text: caption.speak,
      holdMs: caption.holdMs,
    }
  return { kind: 'read', ms: caption.holdMs }
}

export function knownMs(pace: Pace): number | null {
  return pace.kind === 'read' ? pace.ms : null
}

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
      utterance.onerror = (event) => {
        if (event.error !== 'interrupted' && event.error !== 'canceled') later(pace.holdMs)
      }
      synth.speak(utterance)
      later(pace.holdMs * 3)
      return () => {
        clearTimers()
        utterance.onend = null
        utterance.onerror = null
        synth.cancel()
      }
    }
  }
}
