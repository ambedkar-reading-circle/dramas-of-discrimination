import { useMediaQuery } from './useMediaQuery.ts'

export const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

/** Live `prefers-reduced-motion: reduce` state. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(reducedMotionQuery)
}
