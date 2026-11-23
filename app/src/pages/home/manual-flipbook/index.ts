// ManualBook must stay a deep dynamic import: statically re-exporting it here
// would pull page-flip and the engine into the eager section chunk.
// The turn helpers below are pure and do not load page-flip.
export { ManualReading } from './components/ManualPages'
export { manualEmail } from './content/manualContent.ts'
export { spreadCount, spreadIndexForPage } from './engine/spreadPlan.ts'
