import type { SpeakerNote, Slide } from '../types'
import type { Cue, CueState, CueWait } from './cues'

/** One caption on screen: its name, what it says, what is read aloud, and how long it holds when read. */
export type Caption = Readonly<{
  /** A short hash of what is read aloud. A recording is named after it, so it stays matched to its words however the notes around them change. */
  id: string
  say: string
  /** Empty for a cue's point, which keeps the caption before it on screen and says nothing. */
  speak: string
  holdMs: number
}>

/**
 * One point of a slide: one entry of its speaker notes, a line or a cue. The
 * deck's arrows step from point to point, and the slide number carries it
 * (4.3: slide 4, third point).
 */
export type Point = Readonly<{
  /** A line cut into caption-sized pieces, or for a cue the one caption already up. */
  captions: ReadonlyArray<Caption>
  /** Every cue in effect at this point: the slide shows this state. */
  cues: CueState
  /** The film this point waits on before the deck moves on. */
  wait?: CueWait
}>

/** Where the deck stands among a slide's points, and a way to move it to another. */
export type SlidePoints = Readonly<{
  /** The slide's points, and the number of the one the deck is on (1-based). */
  points: ReadonlyArray<Point>
  point: number
  /** Moves the deck to another point of the same slide. */
  goToPoint: (point: number) => void
}>

/** A cue's point holds the caption before it this long while the slide acts. */
const cueMs = 1200

/** A caption longer than this is split, as film subtitles are, so two lines hold it in the player. */
const chunkChars = 140

/** Pieces merged back up to the limit; short pieces (and stray initials like "R.") join a neighbour so each chunk reads whole. */
function packed(pieces: ReadonlyArray<string>): Array<string> {
  const chunks: Array<string> = []
  for (const piece of pieces) {
    const last = chunks.at(-1)
    if (last !== undefined && (last.length + 1 + piece.length <= chunkChars || last.length < 24 || piece.length < 24)) chunks[chunks.length - 1] = `${last} ${piece}`
    else chunks.push(piece)
  }
  return chunks
}

/**
 * Splits a speaker note into caption-sized chunks: at sentence ends first,
 * then, for a sentence still too long, after its commas, semicolons and
 * colons. A clause with no such break stays whole.
 */
export function chunksOf(text: string): ReadonlyArray<string> {
  if (text.length <= chunkChars) return [text]
  const sentences = packed(text.split(/(?<=[.!?…][”"’)]?)\s+(?=[“"‘(]?[A-Z])/))
  return sentences.flatMap((sentence) => (sentence.length <= chunkChars ? [sentence] : packed(sentence.split(/(?<=[,;:][”’"]?)\s+/))))
}

/** A caption's id: the FNV-1a hash of what it reads aloud, in hex. */
export function captionId(speak: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < speak.length; i++) {
    hash ^= speak.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

/** A caption that shows and reads the same words, held for their reading time. */
const spoken = (text: string): Caption => ({ id: captionId(text), say: text, speak: text, holdMs: readingMs(text) })

/** Reading time at a calm pace, so long quotes are not rushed and short lines do not linger. */
export function readingMs(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.min(Math.max(1800 + words * 330, 2500), 14000)
}

/** The slide's notes as parts in reading order: the whole notes, or one part per tab with the cue its lines play under. */
function partsOf(slide: Slide): ReadonlyArray<{ notes: ReadonlyArray<SpeakerNote>; cue: Cue | null }> {
  if (slide.speakerNoteTabs) {
    return slide.speakerNoteTabs.map((tab) => ({ notes: tab.speakerNotes?.length ? tab.speakerNotes : [tab.label], cue: tab.cue ?? null }))
  }
  return [{ notes: slide.speakerNotes?.length ? slide.speakerNotes : [slide.heading], cue: null }]
}

const withCue = (state: CueState, cue: Cue): CueState => ({ ...state, [cue.set]: cue.to })

/**
 * Every point of a slide, one per entry of its speaker notes. A cue holds
 * from its point on, until another cue sets the same target; a tab's cue
 * holds over that tab's points. A film cue holds its own point only.
 */
export function pointsOf(slide: Slide): ReadonlyArray<Point> {
  const points: Array<Point> = []
  let state: CueState = {}
  const lastSay = () => points.at(-1)?.captions.at(-1)?.say ?? ''
  for (const { notes, cue: tabCue } of partsOf(slide)) {
    if (tabCue) state = withCue(state, tabCue)
    for (const note of notes) {
      if (typeof note !== 'string') {
        const cues = withCue(state, note)
        points.push({ captions: [{ id: captionId(''), say: lastSay(), speak: '', holdMs: cueMs }], cues, wait: note.wait })
        if (!note.wait) state = cues
        continue
      }
      // One space between words, so a caption packed back from its pieces reads as written.
      const text = note.replace(/\s+/g, ' ').trim()
      if (text === '') continue
      points.push({ captions: chunksOf(text).map(spoken), cues: state })
    }
  }
  // Notes that read as nothing (blank lines) still leave the slide one point: its heading.
  return points.length > 0 ? points : [{ captions: [spoken(slide.heading)], cues: {} }]
}
