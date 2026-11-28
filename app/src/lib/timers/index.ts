export type Timers = Readonly<{
  after: (ms: number, run: () => void) => void
  clear: () => void
}>

export function createTimers(): Timers {
  let pending: Array<ReturnType<typeof setTimeout>> = []
  return {
    after: (ms, run) => {
      pending.push(setTimeout(run, ms))
    },
    clear: () => {
      pending.forEach(clearTimeout)
      pending = []
    },
  }
}
