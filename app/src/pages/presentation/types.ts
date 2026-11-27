import type { ReactNode } from 'react'
import type { Cue } from './playback/cues'

export type AssetSlot = Readonly<{
  role: 'image' | 'video' | 'document'
  note?: string
}>

/**
 * One entry of a slide's speaker notes, and so one point of the deck (4.3):
 * a line to say, or a cue such as `{ set: 'approach', to: 'forum' }`. A cue
 * is never shown or read aloud; the slide shows what it sets from its point
 * on, until another cue sets the same target. The slide reads the target
 * with `useCueTarget`.
 */
export type SpeakerNote = string | Cue

export type Slide = Readonly<{
  id: string
  kicker: string
  heading: string
  body?: ReactNode
  interactive?: ReactNode
  assets?: ReadonlyArray<AssetSlot>
  layout?: 'default' | 'split' | 'grid' | 'centered' | 'fill'
  /** The body renders its own heading. The stage adds no h2, and the running head shows the count only. */
  ownsHeading?: boolean
  /**
   * Speaker notes: what to say over this slide, as lines read in order, with
   * the slide's cues between them. Each entry is a point the arrows step
   * through, and the lines play as the slide's captions in self-facilitation.
   * Cues before the first line set how the slide opens, without a point of
   * their own.
   */
  speakerNotes?: ReadonlyArray<SpeakerNote>
}>
