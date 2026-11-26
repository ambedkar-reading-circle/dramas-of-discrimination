import type { Slide } from '../types'
import { isTabCue, tabCue } from './cues'

/** A beat ready to play: its caption resolved, its hold worked out. */
export type PlayBeat = Readonly<{
  /** The caption on screen. Beats woven into one caption share it, so it stays put while they play. */
  say: string
  /** The part of the caption this beat covers, read aloud when the voice is on. Empty for a beat the slide carries alone. */
  speak: string
  cue: string | null
  holdMs: number
  waitFor?: 'video'
  /**
   * Which state of the slide this beat is in, from 1 on arrival: it goes up
   * each time a cue moves the slide (opens, switches or plays something).
   */
  step: number
}>

/** A cue marker woven into a speaker note: `[[cue]]`, `[[cue hold=3500]]`, `[[cue wait=video]]`. */
type Marker = Readonly<{ at: number; cue: string; holdMs?: number; waitFor?: 'video' }>

/** A marker with nothing to read after it holds the caption this long while the slide acts. */
const continuationMs = 3000

/** The shortest a woven part of a caption holds, so a cue on the next word still lands. */
const shortestPartMs = 900

/** A caption longer than this is split, as film subtitles are, so two lines hold it in the player. */
const chunkChars = 140

const markerPattern = /\s*\[\[\s*([^\]\s]+)((?:\s+[a-z]+=[^\]\s]+)*)\s*\]\]\s*/g

/**
 * Takes the cue markers out of a speaker note: the note as it is read, and
 * each marker with the place in that text where it fires.
 */
export function parseNote(raw: string): { text: string; markers: ReadonlyArray<Marker> } {
  const markers: Array<Marker> = []
  let text = ''
  let cursor = 0
  // One space between words, so a caption packed back from its pieces is still found in the text.
  const note = raw.replace(/\s+/g, ' ')
  for (const match of note.matchAll(markerPattern)) {
    text += note.slice(cursor, match.index)
    // The marker and the spaces around it become one space, or none at either end.
    const at = text.length
    const options = Object.fromEntries(match[2].trim().split(/\s+/).filter(Boolean).map((pair) => pair.split('=') as [string, string]))
    const holdMs = options.hold ? Number(options.hold) : undefined
    markers.push({ at, cue: match[1], holdMs: Number.isFinite(holdMs) ? holdMs : undefined, waitFor: options.wait === 'video' ? 'video' : undefined })
    cursor = match.index + match[0].length
    if (text !== '' && cursor < note.length) text += ' '
  }
  text += note.slice(cursor)
  // A marker that fell on the space it left behind belongs to the word after it.
  return { text: text.trim(), markers: markers.map((marker) => ({ ...marker, at: Math.min(marker.at, text.trim().length) })) }
}

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

/** Reading time at a calm pace, so long quotes are not rushed and short lines do not linger. */
export function readingMs(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.min(Math.max(1800 + words * 330, 2500), 14000)
}

/** The slide's notes in reading order, each with the cue its tab gives it. */
function notesOf(slide: Slide): ReadonlyArray<{ note: string; cue: string | null }> {
  if (slide.speakerNoteTabs) {
    return slide.speakerNoteTabs.flatMap((tab, index) => {
      const cue = tabCue(index)
      const points = tab.speakerNotes?.length ? tab.speakerNotes : [tab.label]
      return points.map((note) => ({ note, cue }))
    })
  }
  if (slide.speakerNotes?.length) return slide.speakerNotes.map((note) => ({ note, cue: null }))
  return [{ note: slide.heading, cue: null }]
}

/**
 * Every beat of a slide, woven from its speaker notes. Each note is cut into
 * captions, and each caption into parts at the cue markers inside it, so a
 * cue fires at the words it sits before without breaking the caption. A cue
 * holds until the next marker or the end of its note.
 */
export function beatsOf(slide: Slide): ReadonlyArray<PlayBeat> {
  const beats = notesOf(slide).flatMap(({ note, cue }) => beatsOfNote(note, cue))
  // Notes that read as nothing (no tabs, or blank points) still leave the slide one beat: its heading.
  return withSteps(beats.length > 0 ? beats : [{ say: slide.heading, speak: slide.heading, cue: null, holdMs: readingMs(slide.heading) }])
}

function beatsOfNote(note: string, defaultCue: string | null): ReadonlyArray<Omit<PlayBeat, 'step'>> {
  const { text, markers } = parseNote(note)
  const beats: Array<Omit<PlayBeat, 'step'>> = []
  let cue = defaultCue
  let chunkStart = 0
  // Where the last caption ended: a marker in the gap between two captions opens the next.
  let previousEnd = 0
  for (const chunk of chunksOf(text)) {
    chunkStart = text.indexOf(chunk, chunkStart)
    const end = chunkStart + chunk.length
    const last = end >= text.length
    const total = readingMs(chunk)
    // The markers this caption carries; the last caption also takes those at the very end.
    const inside = markers.filter((marker) => marker.at >= previousEnd && (marker.at < end || (last && marker.at === end)))
    const cuts = [chunkStart, ...inside.map((marker) => Math.max(marker.at, chunkStart)), end]
    previousEnd = end
    // The caption's first part: a caption with no markers holds for its whole reading time.
    let firstPart = true
    for (let index = 0; index < cuts.length - 1; index += 1) {
      const marker = index > 0 ? inside[index - 1] : undefined
      if (marker) cue = marker.cue
      const speak = text.slice(cuts[index], cuts[index + 1]).trim()
      // The caption opens with the text before its first marker, if it has any.
      if (index === 0 && speak === '') continue
      const share = Math.max(shortestPartMs, Math.round((total * speak.length) / chunk.length))
      const holdMs = marker?.holdMs ?? (speak === '' ? continuationMs : firstPart && cuts.length === 2 ? total : share)
      beats.push({ say: chunk, speak, cue, holdMs, waitFor: marker?.waitFor })
      firstPart = false
    }
    chunkStart = end
  }
  return beats
}

/**
 * Numbers the slide's states. A cue counts as a move when it differs from
 * the beat before; a `tab:` cue only when it changes the tab, since a slide's
 * own cues (Generate, Edit) can come between two beats of the same tab. A
 * beat with no cue keeps the step it is in.
 */
function withSteps(beats: ReadonlyArray<Omit<PlayBeat, 'step'>>): ReadonlyArray<PlayBeat> {
  let step = 1
  let lastTab: string | null = null
  return beats.map((beat, index) => {
    const before = index > 0 ? beats[index - 1].cue : null
    const tab = isTabCue(beat.cue)
    const moves = beat.cue !== null && (tab ? beat.cue !== lastTab : beat.cue !== before)
    if (tab) lastTab = beat.cue
    // The slide's first state is step 1, whatever cue brings it in.
    if (moves && index > 0) step += 1
    return { ...beat, step }
  })
}
