import type { ReactNode } from 'react'
import type { Cue } from './playback/cues'

export type AssetSlot = Readonly<{
  role: 'image' | 'video' | 'document'
  note?: string
}>

export type SpeakerNote = string | Cue

export type SlideId = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'

export type Slide = Readonly<{
  id: SlideId
  kicker: string
  heading: string
  body?: ReactNode
  interactive?: ReactNode
  assets?: ReadonlyArray<AssetSlot>
  layout?: 'default' | 'split' | 'grid' | 'centered' | 'fill'
  ownsHeading?: boolean
  speakerNotes?: ReadonlyArray<SpeakerNote>
}>
