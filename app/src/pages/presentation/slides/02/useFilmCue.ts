import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { videoOrigin } from '#/components/TabletVideoFrame'
import { useLatest } from '#/lib/use-latest'
import { usePlayback } from '../../playback/playback'
import { useCueTarget } from '../../playback/targets'

type FilmState = 'playing' | 'stopped'

declare module '../../playback/cues' {
  interface CueTargets {
    film: FilmState
  }
}

const ended = 0
const playingState = 1

const unmuteGraceMs = 2500
const silentPlayerMs = 7000

function stateOf(data: unknown): number | null {
  let message: unknown = data
  if (typeof data === 'string') {
    try {
      message = JSON.parse(data)
    } catch {
      return null
    }
  }
  if (!message || typeof message !== 'object' || !('event' in message) || !('info' in message)) return null
  const { event, info } = message
  if (event === 'onStateChange' && typeof info === 'number') return info
  if (event === 'infoDelivery' && info && typeof info === 'object' && 'playerState' in info && typeof info.playerState === 'number') return info.playerState
  return null
}

export function useFilmCue(frame: RefObject<HTMLIFrameElement | null>) {
  const playback = usePlayback()
  const wanted = useRef(false)
  const confirmed = useRef(false)
  const abandoned = useRef(false)
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const resolve = useLatest(playback?.resolveWait)

  const player = () => frame.current?.contentWindow ?? null
  const post = (message: object) => player()?.postMessage(JSON.stringify({ ...message, id: 1, channel: 'widget' }), videoOrigin)
  const command = (func: string) => {
    post({ event: 'listening' })
    post({ event: 'command', func, args: [] })
  }
  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== videoOrigin || event.source !== player()) return
      const state = stateOf(event.data)
      if (state === null) return
      if (state === playingState) {
        confirmed.current = true
        clearTimers()
        if (abandoned.current) {
          abandoned.current = false
          command('pauseVideo')
        }
      }
      if (state === ended && wanted.current) {
        wanted.current = false
        resolve.current?.()
      }
    }
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      clearTimers()
    }
  }, [frame])

  const setFilm = (state: FilmState) => {
    clearTimers()
    if (state === 'playing' && playback?.playing === true) {
      wanted.current = true
      confirmed.current = false
      abandoned.current = false
      command('playVideo')
      timers.current.push(
        setTimeout(() => {
          command('mute')
          command('playVideo')
        }, unmuteGraceMs),
        setTimeout(() => {
          if (confirmed.current || !wanted.current) return
          wanted.current = false
          abandoned.current = true
          command('pauseVideo')
          resolve.current?.()
        }, silentPlayerMs),
      )
    } else if (wanted.current) {
      wanted.current = false
      command('pauseVideo')
    }
  }
  useCueTarget('film', setFilm, { rest: 'stopped' })

  const paused = playback?.playing === false
  useEffect(() => {
    if (!paused || !wanted.current) return
    clearTimers()
    command('pauseVideo')
  }, [paused])
}
