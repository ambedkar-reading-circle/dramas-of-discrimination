import type { Slide } from '../types'
import type { Cue, CueState, CueWait } from './cues'

/** One caption on screen: what it says, what is read aloud, and how long it holds when read. */
export type Caption = Readonly<{
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

/** The deck at one slide, as the slide's cue targets read it: its points, the cues in effect at the current one, and how many times they have been applied. */
export type SlideCues = SlidePoints &
  Readonly<{
    /** The id of the slide the points belong to. */
    slideId: string
    cues: CueState
    /**
     * Counts each time the cues are applied: when the deck moves to a point, or play is pressed. The
     * slide then shows that point's cues again, so a change made by hand inside
     * it lasts only until the deck moves.
     */
    cuesApplied: number
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

/** A caption that shows and reads the same words, held for their reading time. */
const spoken = (text: string): Caption => ({ say: text, speak: text, holdMs: readingMs(text) })

/** Reading time at a calm pace, so long quotes are not rushed and short lines do not linger. */
export function readingMs(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.min(Math.max(1800 + words * 330, 2500), 14000)
}

const withCue = (state: CueState, cue: Cue): CueState => ({ ...state, [cue.set]: cue.to })

/**
 * Every point of a slide, one per entry of its speaker notes. A cue holds
 * from its point on, until another cue sets the same target; cues before the
 * first line set how the slide opens, and take no point of their own. A film
 * cue holds its own point only.
 */
export function pointsOf(slide: Slide): ReadonlyArray<Point> {
  const points: Array<Point> = []
  let state: CueState = {}
  const lastSay = () => points.at(-1)?.captions.at(-1)?.say ?? ''
  for (const note of slide.speakerNotes ?? []) {
    if (typeof note !== 'string') {
      const cues = withCue(state, note)
      if (points.length === 0 && !note.wait) {
        state = cues
        continue
      }
      points.push({ captions: [{ say: lastSay(), speak: '', holdMs: cueMs }], cues, wait: note.wait })
      if (!note.wait) state = cues
      continue
    }
    // One space between words, so a caption packed back from its pieces reads as written.
    const text = note.replace(/\s+/g, ' ').trim()
    if (text === '') continue
    points.push({ captions: chunksOf(text).map(spoken), cues: state })
  }
  // Notes that read as nothing (blank lines) still leave the slide one point: its heading.
  return points.length > 0 ? points : [{ captions: [spoken(slide.heading)], cues: state }]
}
