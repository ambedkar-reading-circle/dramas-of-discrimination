import { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import type { Ref } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useMediaQuery } from '#/lib/use-media-query'
import SlideAssetPlaceholder from './SlideAssetPlaceholder'
import type { Slide } from '../types'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const spring = { type: 'spring' as const, stiffness: 220, damping: 28 }

export type SlideStageHandle = {
  focusHeading: () => void
}

interface SlideStageProps {
  slide: Slide
  index: number
  total: number
  ref?: Ref<SlideStageHandle>
}

export default function SlideStage({ slide, index, total, ref }: SlideStageProps) {
  const reducedMotion = useMediaQuery(reducedMotionQuery)
  const stage = useRef<HTMLDivElement>(null)
  const fit = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement | null>(null)
  const [scale, setScale] = useState(1)
  const mounted = useRef(false)
  const focusHeading = useCallback(() => {
    const label = stage.current?.getAttribute('aria-label') ?? ''
    const named = [...(stage.current?.querySelectorAll<HTMLElement>('h1, h2') ?? [])].find((item) => label.endsWith(item.textContent))
    const target = named ?? heading.current
    target?.focus({ preventScroll: true })
  }, [])
  useImperativeHandle(ref, () => ({ focusHeading }), [focusHeading])

  // Direction of travel for the slide transition, derived during render so the
  // entering variant sees the correct side on its first frame.
  const lastIndex = useRef(index)
  const [direction, setDirection] = useState(1)
  if (index !== lastIndex.current) {
    setDirection(index > lastIndex.current ? 1 : -1)
    lastIndex.current = index
  }

  // Shrink a slide that is taller or wider than the stage. Scaling up would
  // leave the notebook's type size, so extra room stays empty.
  useLayoutEffect(() => {
    const stageEl = stage.current
    const fitEl = fit.current
    if (!stageEl || !fitEl) return

    let frame = 0
    const measure = () => {
      const availableH = stageEl.clientHeight
      const availableW = stageEl.clientWidth
      const neededH = fitEl.scrollHeight
      const neededW = fitEl.scrollWidth
      if (availableH <= 0 || availableW <= 0 || neededH <= 0 || neededW <= 0) return
      // Narrow stages reflow and scroll. Scaling them to fit makes the type unreadably small.
      const fitted = Math.min(1, availableH / neededH, availableW / neededW)
      const next = availableW < 700 ? 1 : fitted
      setScale((current) => (Math.abs(current - next) < 0.005 ? current : next))
    }

    measure()
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    })
    observer.observe(stageEl)
    observer.observe(fitEl)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [index, slide.id])

  // Move focus to the new slide's heading so keyboard users are never stranded
  // inside the previous slide's embed; reset the stage scroll for each slide.
  useEffect(() => {
    if (mounted.current) focusHeading()
    else mounted.current = true
    stage.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [focusHeading, index])

  const variants = {
    enter: (dir: number) => (reducedMotion ? { opacity: 0 } : { opacity: 0, x: `${6 * dir}%` }),
    center: { opacity: 1, x: '0%' },
    exit: (dir: number) => (reducedMotion ? { opacity: 0 } : { opacity: 0, x: `${-6 * dir}%` }),
  }

  const ownsHeading = slide.ownsHeading === true

  return (
    <div ref={stage} className="slide-stage" role="group" aria-roledescription="slide" aria-label={`Slide ${index} of ${total}: ${slide.heading}`}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div key={slide.id} className={`slide-frame${scale < 1 ? ' slide-frame--scaled' : ''}`} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={reducedMotion ? { duration: 0 } : spring}>
          <div ref={fit} className={`slide slide--${slide.layout ?? 'default'}`} style={scale < 1 ? { transform: `scale(${scale})`, transformOrigin: 'top center' } : undefined}>
            {!ownsHeading && (
              <h2 ref={heading} className="slide-heading" tabIndex={-1}>
                {slide.heading}
              </h2>
            )}
            <div className="slide-body">{slide.body}</div>
            {slide.interactive && <div className="slide-interactive">{slide.interactive}</div>}
            {slide.assets?.map((asset) => (
              <SlideAssetPlaceholder key={`${asset.role}-${asset.note ?? ''}`} role={asset.role} note={asset.note} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
