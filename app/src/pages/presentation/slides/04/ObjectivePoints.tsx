import { useEffect, useMemo, useRef, useState } from 'react'
import { useRoughAnnotation } from '#/lib/rough-notation'
import type { RoughAnnotationConfig } from '#/lib/rough-notation'
import { useMediaQuery } from '#/lib/use-media-query'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function AnnotatedPhrase({ text }: { text: string }) {
  const target = useRef<HTMLSpanElement>(null)
  const reducedMotion = useMediaQuery(reducedMotionQuery)
  const config = useMemo<RoughAnnotationConfig>(
    () => ({
      type: 'underline',
      color: 'currentColor',
      strokeWidth: 2,
      padding: [0, 2],
      animationDuration: 400,
      hideDuration: 200,
      animate: !reducedMotion,
    }),
    [reducedMotion],
  )
  const { show } = useRoughAnnotation(target, config)
  useEffect(() => {
    const draw = window.setTimeout(show, 200)
    return () => window.clearTimeout(draw)
  }, [show])
  return (
    <span className="slide-annotated">
      <span ref={target}>{text}</span>
    </span>
  )
}

export function ObjectivePoints() {
  const points = [
    { lead: 'Rehearse responses', detail: 'Groups stage a Scenario and retry interventions until they hold.' },
    { lead: 'Name caste in workplaces', detail: 'The discrimination the method works on is named — not smoothed over.' },
    { lead: 'Build a rehearsal platform', detail: 'An open-source app so other Communities can run the Workshop without us.' },
  ]
  const [shown, setShown] = useState(0)
  return (
    <div className="slide-points">
      <ul>
        {points.slice(0, shown).map((point) => (
          <li className="slide-point rise-in" key={point.lead}>
            <p>
              <AnnotatedPhrase text={point.lead} />
              <span className="slide-point-detail"> — {point.detail}</span>
            </p>
          </li>
        ))}
      </ul>
      {shown < points.length && (
        <button className="slide-points-next" type="button" onClick={() => setShown((value) => value + 1)}>
          <span className="notebook-text">Reveal the next point</span>
        </button>
      )}
    </div>
  )
}
