import { useCallback, useRef } from 'react'

type FilmWaitInput = Readonly<{
  waiting: boolean
  playing: boolean
  cuesApplied: number
  advance: () => void
}>

export function useFilmWait({ waiting, playing, cuesApplied, advance }: FilmWaitInput) {
  const endedAt = useRef<number | null>(null)

  const resolveWait = useCallback(() => {
    if (!waiting) return
    if (playing) advance()
    else endedAt.current = cuesApplied
  }, [waiting, playing, advance, cuesApplied])

  const endedWhilePaused = useCallback(() => {
    const ended = endedAt.current === cuesApplied
    endedAt.current = null
    return ended
  }, [cuesApplied])

  return { resolveWait, endedWhilePaused }
}
