import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { SlideDirectionContext } from '../hooks/useSlideDirection'
import { SlideStageHostContext } from '../hooks/useSlideStageHost'
import SlideAssetPlaceholder from './SlideAssetPlaceholder'
import { controlSelector, typingSelector } from '../keyTargets'
import { usePlayback } from '../playback/playback'
import { CueScope } from '../playback/targets'
import type { Slide } from '../types'

const spring = { type: 'spring' as const, stiffness: 220, damping: 28 }

interface SlideStageProps {
  slide: Slide
  index: number
  total: number
}

export default function SlideStage({ slide, index, total }: SlideStageProps) {
  const reducedMotion = usePrefersReducedMotion()
  const stage = useRef<HTMLDivElement>(null)
  // The overlay host sits over the stage but outside its scroll, so a photo
  // flies to the centre of what is in view, not of the slide's first screenful.
  // State, not a ref, so slide bodies re-render once it mounts.
  const [host, setHost] = useState<HTMLDivElement | null>(null)
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

  // Direction of travel for the slide transition, derived during render so the
  // entering variant sees the correct side on its first frame.
  const lastIndex = useRef(index)
  const [direction, setDirection] = useState<1 | -1>(1)
  if (index !== lastIndex.current) {
    setDirection(index > lastIndex.current ? 1 : -1)
    lastIndex.current = index
  }

  // Shrink a slide that is taller or wider than the stage. Scaling up would
  // leave the notebook's type size, so extra room stays empty.
  // A fill slide sizes itself to the stage, and its entrance travels outside
  // it on purpose, so it is never measured or scaled.
  const fills = slide.layout === 'fill'
  useLayoutEffect(() => {
    const stageEl = stage.current
    const fitEl = fit.current
    if (!stageEl || !fitEl) return
    if (fills) {
      setScale(1)
      return
    }

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
  }, [index, slide.id, fills])

  // Move focus to the new slide's heading so keyboard users are never stranded
  // inside the previous slide's embed; reset the stage scroll for each slide.
  useEffect(() => {
    if (mounted.current) focusHeading()
    else mounted.current = true
    stage.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [focusHeading, index])

  // A fill slide's frame holds still: its content brings its own entrance
  // and exit (the same variant names), and a frame fade would wash it out.
  const variants =
    fills && !reducedMotion
      ? { enter: { opacity: 1, x: '0%' }, center: { opacity: 1, x: '0%' }, exit: { opacity: 1, x: '0%', transition: { when: 'afterChildren' } } }
      : {
          enter: (dir: number) => (reducedMotion ? { opacity: 0 } : { opacity: 0, x: `${6 * dir}%` }),
          center: { opacity: 1, x: '0%' },
          exit: (dir: number) => (reducedMotion ? { opacity: 0 } : { opacity: 0, x: `${-6 * dir}%` }),
        }

  const ownsHeading = slide.ownsHeading === true

  // Reaching into the slide while it plays pauses playback, so the room can
  // explore; play picks up on the same caption. Keys only count when they
  // work a control, so arrows and Space on the stage still drive the deck.
  const playback = usePlayback()
  const playing = playback?.playing === true
  const pause = playback?.pause
  const pauseOnClick = () => {
    if (playing) pause?.()
  }
  const pauseOnKey = (event: KeyboardEvent<HTMLElement>) => {
    if (!playing || !(event.target instanceof Element)) return
    const typing = event.target.closest(typingSelector)
    const pressing = (event.key === 'Enter' || event.key === ' ') && event.target.closest(controlSelector)
    if (typing || pressing) pause?.()
  }

  return (
    <div className="slide-stage-shell" onClickCapture={pauseOnClick} onKeyDownCapture={pauseOnKey}>
      <div ref={stage} className="slide-stage" role="group" aria-roledescription="slide" aria-label={`Slide ${index} of ${total}: ${slide.heading}`}>
        <SlideStageHostContext value={host}>
          <SlideDirectionContext value={direction}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div key={slide.id} className={`slide-frame${scale < 1 ? ' slide-frame--scaled' : ''}`} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={reducedMotion ? { duration: 0 } : spring}>
                <CueScope slideId={slide.id}>
                <div ref={fit} className={`slide slide--${slide.layout ?? 'default'}`} style={scale < 1 ? { transform: `scale(${scale})`, transformOrigin: 'top center' } : undefined}>
                  {!ownsHeading && (
                    <h2 ref={heading} className="slide-heading" tabIndex={-1}>
                      {slide.heading}
                    </h2>
                  )}
                  {slide.body != null && <div className="slide-body">{slide.body}</div>}
                  {slide.interactive && <div className="slide-interactive">{slide.interactive}</div>}
                  {slide.assets?.map((asset) => (
                    <SlideAssetPlaceholder key={`${asset.role}-${asset.note ?? ''}`} role={asset.role} note={asset.note} />
                  ))}
                </div>
                </CueScope>
              </motion.div>
            </AnimatePresence>
          </SlideDirectionContext>
        </SlideStageHostContext>
      </div>
      <div ref={setHost} className="slide-stage-overlay" />
    </div>
  )
}
