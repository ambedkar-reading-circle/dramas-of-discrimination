import type { Slide } from '../../types'
import { speakerNotes } from './content/speakerNotes'
import { MethodEmbed } from './MethodEmbed'

export const slide = {
  id: '05',
  kicker: 'The method',
  heading: 'The five acts of the Workshop',
  interactive: <MethodEmbed />,
  speakerNotes,
} satisfies Slide
