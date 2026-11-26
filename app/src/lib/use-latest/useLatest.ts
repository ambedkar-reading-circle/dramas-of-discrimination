import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'

/**
 * A ref that always holds the value from the latest render, so an effect or
 * timer can read it without restarting each time it changes.
 */
export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value)
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}
