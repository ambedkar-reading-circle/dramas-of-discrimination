export type Worksheet = Readonly<{
  id: string
  label: string
  title: string
  description: string
  imageUrl: string
  width: number
  height: number
}>

export const worksheets: ReadonlyArray<Worksheet> = [
  {
    id: 'actors-activities-challenges',
    label: 'Worksheet 01',
    title: 'Actors, Activities, Challenges',
    description:
      'Identify the people involved, their responsibilities, and the barriers they face.',
    imageUrl: '/DD_ARC_WS_Sheet1.jpg',
    width: 1684,
    height: 1191,
  },
  {
    id: 'storytime',
    label: 'Worksheet 02',
    title: 'Storytime',
    description:
      'Turn the scenario into a script: who says what to whom, and where it goes wrong.',
    imageUrl: '/DD_ARC_WS_Sheet2.jpg',
    width: 1684,
    height: 1191,
  },
]
