import type { Slide, SlideId } from '../types'
import type { Cue, CueState } from './cues'

export type Caption = Readonly<{
  say: string
  speak: string
  holdMs: number
}>

export type Point = Readonly<{
  captions: ReadonlyArray<Caption>
  cues: CueState
  wait?: Cue['wait']
}>

export type SlidePoints = Readonly<{
  points: ReadonlyArray<Point>
  point: number
  goToPoint: (point: number) => void
}>

export type SlideCues = SlidePoints &
  Readonly<{
    slideId: SlideId
    cues: CueState
    cuesApplied: number
  }>

const cueMs = 1200

const chunkChars = 140

function packed(pieces: ReadonlyArray<string>): Array<string> {
  const chunks: Array<string> = []
  for (const piece of pieces) {
    const last = chunks.at(-1)
    if (last !== undefined && (last.length + 1 + piece.length <= chunkChars || last.length < 24 || piece.length < 24)) chunks[chunks.length - 1] = `${last} ${piece}`
    else chunks.push(piece)
  }
  return chunks
}

export function chunksOf(text: string): ReadonlyArray<string> {
  if (text.length <= chunkChars) return [text]
  const sentences = packed(text.split(/(?<=[.!?…][”"’)]?)\s+(?=[“"‘(]?[A-Z])/))
  return sentences.flatMap((sentence) => (sentence.length <= chunkChars ? [sentence] : packed(sentence.split(/(?<=[,;:][”’"]?)\s+/))))
}

const spoken = (text: string): Caption => ({ say: text, speak: text, holdMs: readingMs(text) })

export function readingMs(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.min(Math.max(1800 + words * 330, 2500), 14000)
}

const withCue = (state: CueState, cue: Cue): CueState => ({ ...state, [cue.set]: cue.to })

export function pointsOf(slide: Slide): ReadonlyArray<Point> {
  const points: Array<Point> = []
  let state: CueState = {}
  let lastSay = ''
  for (const note of slide.speakerNotes ?? []) {
    if (typeof note !== 'string') {
      const cues = withCue(state, note)
      if (points.length === 0 && !note.wait) {
        state = cues
        continue
      }
      points.push({ captions: [{ say: lastSay, speak: '', holdMs: cueMs }], cues, wait: note.wait })
      if (!note.wait) state = cues
      continue
    }
    const text = note.replace(/\s+/g, ' ').trim()
    if (text === '') continue
    const captions = chunksOf(text).map(spoken)
    points.push({ captions, cues: state })
    lastSay = captions[captions.length - 1].say
  }
  return points.length > 0 ? points : [{ captions: [spoken(slide.heading)], cues: state }]
}
