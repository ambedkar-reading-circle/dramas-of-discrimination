export type Contributor = Readonly<{
  id: string
  name: string
  role: string
}>

const members: ReadonlyArray<Contributor> = [
  { id: 'abhijit-waghre', name: 'Abhijit Waghre', role: 'Design' },
  { id: 'akbar-allahbaksh', name: 'Akbar Allahbaksh', role: 'Design' },
  {
    id: 'ankitha-mythri-raju',
    name: 'Ankitha Mythri Raju',
    role: 'Facilitator',
  },
  { id: 'ankita', name: 'Ankita', role: 'Design' },
  { id: 'apeksha-singegol', name: 'Apeksha Singegol', role: 'Facilitator' },
  { id: 'ashna-singh', name: 'Dr Ashna Singh', role: 'Facilitator' },
  { id: 'geet', name: 'Geet', role: 'Design' },
  { id: 'goutham', name: 'Goutham', role: 'Design' },
  { id: 'madhu-b-r', name: 'Madhu B R', role: 'Design' },
  { id: 'prashant-bhaware', name: 'Prashant Bhaware', role: 'Design' },
  { id: 'sagar-r-thalvar', name: 'Sagar R Thalvar', role: 'Facilitator' },
]

export const contributors: ReadonlyArray<Contributor> = [...members].sort(
  (a, b) => a.name.localeCompare(b.name),
)
