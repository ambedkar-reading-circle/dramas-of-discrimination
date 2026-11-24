import { useMemo } from 'react'
import type { RefObject } from 'react'
import { useRoughAnnotation } from '#/lib/rough-notation'
import type { RoughAnnotationConfig } from '#/lib/rough-notation'
import { usePrefersReducedMotion } from '#/lib/use-media-query'

export function useWordmarkBracket(target: RefObject<HTMLElement | null>) {
  const reducedMotion = usePrefersReducedMotion()
  const config = useMemo<RoughAnnotationConfig>(
    () => ({
      type: 'bracket',
      brackets: ['left', 'right'],
      color: 'currentColor',
      strokeWidth: 1.5,
      padding: [8, 12],
      animationDuration: 450,
      hideDuration: 200,
      animate: !reducedMotion,
    }),
    [reducedMotion],
  )
  return useRoughAnnotation(target, config)
}
