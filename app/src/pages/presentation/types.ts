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
   * Speaker notes: what to say over this slide, as points read in order. A
   * visitor without a presenter reads the same points.
   */
  speakerNotes?: ReadonlyArray<string>
  /**
   * Speaker notes split into tabs, one per part of the slide, so a slide that
   * covers several things keeps each one's points apart. Takes the place of
   * `speakerNotes`.
   */
  speakerNoteTabs?: ReadonlyArray<SpeakerNoteTab>
}>

export type SpeakerNoteTab = Readonly<{
  label: string
  /** Left out until written; the tab then shows placeholder points. */
  speakerNotes?: ReadonlyArray<string>
}>
