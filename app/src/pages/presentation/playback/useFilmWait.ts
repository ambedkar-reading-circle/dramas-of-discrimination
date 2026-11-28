import { useCallback, useRef } from 'react'

type FilmWaitInput = Readonly<{
  /** The current point waits on the slide's film. */
  waiting: boolean
  playing: boolean
  /** The count of times the cues have been applied: only a new point or a replay changes it. */
  cuesApplied: number
  /** Moves playback on from the point. */
  advance: () => void
}>

/**
 * The film a point waits on. Its end moves the deck on while it plays. The
 * film can also end just after Pause: its point is then done, and
 * `endedWhilePaused` tells play to move on from it rather than start the film
 * over. The end is kept by the cues' count, so turning the voice on while
 * paused leaves it done.
 */
export function useFilmWait({ waiting, playing, cuesApplied, advance }: FilmWaitInput) {
  const endedAt = useRef<number | null>(null)

  /** The slide reports the film it was waiting on has ended. */
  const resolveWait = useCallback(() => {
    if (!waiting) return
    if (playing) advance()
    else endedAt.current = cuesApplied
  }, [waiting, playing, advance, cuesApplied])

  /** Whether the film ended while paused on this point; asking clears it. */
  const endedWhilePaused = useCallback(() => {
    const ended = endedAt.current === cuesApplied
    endedAt.current = null
    return ended
  }, [cuesApplied])

  return { resolveWait, endedWhilePaused }
}
