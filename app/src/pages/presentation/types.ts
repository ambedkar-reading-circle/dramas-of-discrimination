import type { ReactNode } from 'react'

export type AssetSlot = Readonly<{
  role: 'image' | 'video' | 'document'
  note?: string
}>

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
   * Speaker notes: what to say over this slide, as points read in order. They
   * play as the slide's captions in self-facilitation.
   *
   * Cues for the slide are woven into the text as markers, placed before the
   * words they belong to: `[[reveal:forum]]`, with options
   * `[[reveal:educate hold=2500]]` (how long that part holds, in ms) or
   * `[[video:play wait=video]]` (hold until the film ends). Markers are never
   * shown or read aloud. A marker fires as playback reaches its place, holds
   * until the next marker or the end of the note, and is handled in the
   * slide's component with `useSlideCue`.
   */
  speakerNotes?: ReadonlyArray<string>
  /**
   * Speaker notes split into parts, one per part of the slide. Each part's
   * points play under the cue `tab:<index>`, so the slide can show that part;
   * markers in them work as in `speakerNotes`. Takes the place of `speakerNotes`.
   */
  speakerNoteTabs?: ReadonlyArray<SpeakerNoteTab>
}>

export type SpeakerNoteTab = Readonly<{
  label: string
  /** Left out until written; the part then plays its label as its only caption. */
  speakerNotes?: ReadonlyArray<string>
}>
