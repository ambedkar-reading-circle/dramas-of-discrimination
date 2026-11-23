import { useMemo, useRef } from 'react'
import DodLogo from '#/components/DodLogo'
import { useRoughAnnotation } from '#/lib/rough-notation'
import type { RoughAnnotationConfig } from '#/lib/rough-notation'
import { useMediaQuery } from '#/lib/use-media-query'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

export function TitleSlideBody() {
  const wordmark = useRef<HTMLSpanElement>(null)
  const reducedMotion = useMediaQuery(reducedMotionQuery)
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
  const { show, hide } = useRoughAnnotation(wordmark, config)
  return (
    <div className="slide-title rise-in">
      <h1
        className="slide-title-heading"
        tabIndex={-1}
        onPointerEnter={show}
        onPointerLeave={hide}
        onFocus={(e) => {
          if (e.currentTarget.matches(':focus-visible')) show()
        }}
        onBlur={hide}
      >
        <span ref={wordmark}>
          <DodLogo />
        </span>
      </h1>
      <p className="slide-title-subtitle">A workshop and web application for communities to rehearse ethical responses to workplace caste discrimination and author their own manifestos of inclusion.</p>
      <p className="slide-title-attribution">
        After Augusto Boal&apos;s Theatre of the Oppressed — the audience steps in as <em>spect-actors</em>.
      </p>
    </div>
  )
}
