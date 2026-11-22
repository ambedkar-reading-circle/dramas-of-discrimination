// ManualBook must stay a deep dynamic import: statically re-exporting it here
// would pull page-flip and the engine into the eager section chunk.
export { ManualReading } from './components/ManualPages'
