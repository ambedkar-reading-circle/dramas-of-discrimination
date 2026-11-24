import type { InstantPhotoData } from '#/components/InstantPhoto'

export type CircleKey =
  'bangalore' | 'mumbai' | 'delhi' | 'hyderabad' | 'chennai'

export type ValueKey = 'educate' | 'agitate' | 'organize'

export type BoardKey = ValueKey | CircleKey

export interface BoardItem {
  key: BoardKey
  name: string
  handle?: string
}

export interface ReadingCircle extends BoardItem {
  key: CircleKey
  handle: string
  post: string
}

export interface CircleValue extends BoardItem {
  key: ValueKey
  photo: InstantPhotoData
}

export const valuesLabel = "Founded on Babasaheb Ambedkar's call"

export const circlesLabel =
  'Ambedkar reading circles in touch with ARC Bangalore'

export const values: ReadonlyArray<CircleValue> = [
  {
    key: 'educate',
    name: 'Educate',
    photo: {
      src: '/slides/03b.webp',
      alt: 'A crowded room lined floor to ceiling with bookshelves; people sit on the floor facing a speaker, a portrait of Ambedkar on the wall behind.',
      caption: 'Reading anti-caste literature together',
      tilt: -2,
      direction: 'left',
    },
  },
  {
    key: 'agitate',
    name: 'Agitate',
    photo: {
      src: '/slides/03c.jpg',
      alt: 'A painted portrait of Ambedkar leans against a tree in the park, above a tote printed with the Preamble to the Constitution and a pink badge.',
      caption: 'Ambedkar and the Constitution in public space',
      tilt: 1.5,
      direction: 'bottom',
    },
  },
  {
    key: 'organize',
    name: 'Organize',
    photo: {
      src: '/slides/03a.jpg',
      alt: 'About thirty people sit on the leaf-strewn ground in a wide circle under tall trees in Cubbon Park, a poster and books laid on a mat at its centre.',
      caption: 'The monthly circle in Cubbon Park, Bangalore',
      tilt: -1.5,
      direction: 'right',
    },
  },
]

export const circles: ReadonlyArray<ReadingCircle> = [
  {
    key: 'bangalore',
    name: 'ARC Bangalore',
    handle: 'arc.bangalore',
    post: 'https://www.instagram.com/p/CrsHJyISAyB/',
  },
  {
    key: 'mumbai',
    name: 'ARC Mumbai',
    handle: 'arc.mumbai',
    post: 'https://www.instagram.com/p/DE_rQAvNR57/',
  },
  {
    key: 'delhi',
    name: 'ARC Delhi',
    handle: 'ambedkaritereadingcircle_delhi',
    post: 'https://www.instagram.com/p/Db0OPV_mXR6/',
  },
  {
    key: 'hyderabad',
    name: 'BARC Hyderabad',
    handle: 'barc.hyderabad',
    post: 'https://www.instagram.com/p/C3xjqQSSXc6/',
  },
  {
    key: 'chennai',
    name: 'ARC Chennai',
    handle: 'arc.chennai',
    post: 'https://www.instagram.com/p/DLwOowKSTJ4/',
  },
]

export function findByKey<T extends BoardItem>(
  items: ReadonlyArray<T>,
  key: BoardKey | null,
): T | null {
  return items.find((item) => item.key === key) ?? null
}

export function embedUrl(post: string): string {
  const code = /\/p\/([^/?#]+)/.exec(post)?.[1]
  return code ? `https://www.instagram.com/p/${code}/embed/captioned/` : post
}
