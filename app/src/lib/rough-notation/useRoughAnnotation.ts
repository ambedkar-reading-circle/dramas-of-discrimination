import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { annotate } from './annotate'
import type { RoughAnnotation, RoughAnnotationConfig } from './model'

/**
 * Attaches a rough-notation annotation to the element held by `ref`.
 * The annotation is created after mount (never during render, so SSR-safe)
 * and removed on unmount. It is recreated whenever the `config` object
 * identity changes.
 */
export function useRoughAnnotation(
  ref: RefObject<HTMLElement | null>,
  config: RoughAnnotationConfig,
): { show: () => void; hide: () => void } {
  const annotationRef = useRef<RoughAnnotation | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const annotation = annotate(element, config)
    annotationRef.current = annotation
    return () => {
      annotation.remove()
      annotationRef.current = null
    }
  }, [ref, config])

  const show = useCallback(() => {
    annotationRef.current?.show()
  }, [])

  const hide = useCallback(() => {
    annotationRef.current?.hide()
  }, [])

  return { show, hide }
}
