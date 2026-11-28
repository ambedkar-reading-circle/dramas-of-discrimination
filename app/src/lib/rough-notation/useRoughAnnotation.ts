import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { annotate } from './annotate'
import type { RoughAnnotation, RoughAnnotationConfig } from './model'

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
