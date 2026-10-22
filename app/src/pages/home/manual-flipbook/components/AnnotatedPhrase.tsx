import { Fragment, useEffect, useRef } from 'react'
import { useRoughAnnotation } from '#/lib/rough-notation/useRoughAnnotation'
import type { RoughAnnotationConfig, RoughAnnotationType } from '#/lib/rough-notation'
import type { LetterBlock } from '../content/manualContent'

const configs: Record<RoughAnnotationType, RoughAnnotationConfig> = {
  underline: { type: 'underline', color: 'currentColor', strokeWidth: 1, padding: 0, multiline: true, animate: false },
  highlight: { type: 'highlight', color: 'color-mix(in srgb, var(--manual-blue) 16%, transparent)', padding: 0, multiline: true, animate: false, iterations: 1 },
  circle: { type: 'circle', color: 'currentColor', strokeWidth: 1, padding: [1, 4], multiline: true, animate: false },
  box: { type: 'box', color: 'currentColor', strokeWidth: 1, padding: 1, multiline: true, animate: false },
  bracket: { type: 'bracket', color: 'currentColor', strokeWidth: 1, padding: [0, 2], brackets: ['left', 'right'], multiline: true, animate: false },
  'strike-through': { type: 'strike-through', color: 'color-mix(in srgb, var(--manual-blue) 65%, transparent)', strokeWidth: 1, padding: 0, multiline: true, animate: false, iterations: 1 },
  'crossed-off': { type: 'crossed-off', color: 'color-mix(in srgb, var(--manual-blue) 65%, transparent)', strokeWidth: 1, padding: 0, multiline: true, animate: false, iterations: 1 },
}

function AnnotatedPhrase({ text, type, active }: { text: string; type: RoughAnnotationType; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { show } = useRoughAnnotation(ref, configs[type])
  useEffect(() => {
    if (!active) return
    let cancelled = false
    let frame = 0
    // Measure only a settled face, after fonts load. Keep the resulting SVG
    // attached while the leaf turns, rather than measuring transformed text.
    void document.fonts.ready.then(() => {
      if (cancelled) return
      frame = requestAnimationFrame(() => {
        if (!cancelled) show()
      })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [active, show])
  return (
    <span ref={ref} className="manual-annotated-phrase" data-notation={type}>
      {text}
    </span>
  )
}

export function AnnotatedParagraph({ block, active }: { block: LetterBlock; active: boolean }) {
  let cursor = 0
  const phrases = (block.emphasis ?? []).map((phrase) => {
    const start = block.text.indexOf(phrase.text, cursor)
    if (start < 0) return null
    const before = block.text.slice(cursor, start)
    cursor = start + phrase.text.length
    return (
      <Fragment key={phrase.text}>
        {before}
        <AnnotatedPhrase {...phrase} active={active} />
      </Fragment>
    )
  })
  return (
    <p>
      {phrases}
      {block.text.slice(cursor)}
    </p>
  )
}
