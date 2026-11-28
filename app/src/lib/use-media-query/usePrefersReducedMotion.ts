import { useMediaQuery } from './useMediaQuery.ts'

export const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(reducedMotionQuery)
}
