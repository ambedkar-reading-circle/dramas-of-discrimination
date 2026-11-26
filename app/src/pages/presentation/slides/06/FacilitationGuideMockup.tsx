import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { twoDigit } from '#/lib/format'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { workshopActivities } from '#/pages/home/workshop-method'
import { recordedExamples } from './content/recordedExamples'
import { GuideFrame } from '../shared/GuideFrame'
import { stateOf } from '../shared/GuideJourney'
import { motionUnlessReduced } from '../shared/motion'
import { warnCue } from '../../playback/cues'
import { useCueTarget } from '../../playback/targets'
import './FacilitationGuideMockup.css'

/** Every step of the workshop in order, so Back and Next walk the whole journey. */
const journey = workshopActivities.flatMap((activity, act) => activity.steps.map((_, step) => ({ act, step })))

declare module '../../playback/cues' {
  interface CueTargets {
    /** Slide 06: the step of the journey the guide is on. */
    guide: Readonly<{ act: number; step: number }>
  }
}

/** Where a step sits in the journey, or -1 for a step the workshop does not have. */
const positionOf = (act: number, step: number) => journey.findIndex((stop) => stop.act === act && stop.step === step)

/** Stand-in clip lengths for the recorded examples, one per step slot. */
const clipLengths = ['2:10', '1:45', '2:30']

/** Fixed leans, so stickers sit the same way on every render. */
const stickerTilts = [-1.8, 1.4, -0.9, 2.1]

/** The workshop has been running this long when the mockup opens. */
const startElapsed = 47 * 60 + 12

const ease = [0.22, 1, 0.36, 1] as const

function clock(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${twoDigit(h)}:${twoDigit(m)}:${twoDigit(seconds % 60)}`
}

/** A clock that ticks on from where the workshop already is. */
function useElapsed() {
  const [seconds, setSeconds] = useState(startElapsed)
  useEffect(() => {
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => clearInterval(timer)
  }, [])
  return seconds
}

/**
 * Mockup: the facilitation guide a room follows by itself. The whole workshop
 * runs across the top, the current act lies open as a facilitation sheet,
 * a recorded example plays beside its steps, and the room moves on when it
 * says it is ready.
 */
export function FacilitationGuideMockup() {
  const reducedMotion = usePrefersReducedMotion()
  const elapsed = useElapsed()
  const [{ position, direction }, setMove] = useState({ position: journey.findIndex((stop) => stop.act === 1), direction: 1 })
  const { act, step } = journey[position]
  const activity = workshopActivities[act]
  const example = recordedExamples[activity.name][step]
  const isLast = position === journey.length - 1

  const moveTo = (target: number) => setMove({ position: target, direction: target >= position ? 1 : -1 })
  const moveToStop = (target: number) => {
    if (target >= 0 && target !== position) moveTo(target)
  }
  const goTo = (targetAct: number, targetStep: number) => moveToStop(positionOf(targetAct, targetStep))

  // A cue on `guide` walks the room on, as if it had pressed We're ready; a
  // step chosen by hand moves the deck to the point that shows it.
  useCueTarget(
    'guide',
    (stop) => {
      const target = positionOf(stop.act, stop.step)
      if (target < 0) return warnCue({ set: 'guide', to: stop }, 'no such step in the journey')
      moveToStop(target)
    },
    { value: journey[position] },
  )

  // `towards` is the direction of travel: 1 forward, -1 back.
  const fadeVariants: Variants = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
  const sheetVariants: Variants = reducedMotion
    ? fadeVariants
    : {
        enter: (towards: number) => ({ opacity: 0, x: 56 * towards, rotate: 1.2 * towards }),
        center: { opacity: 1, x: 0, rotate: 0 },
        exit: (towards: number) => ({ opacity: 0, x: -40 * towards, rotate: -0.8 * towards }),
      }
  const printVariants: Variants = reducedMotion
    ? fadeVariants
    : {
        enter: (towards: number) => ({ opacity: 0, y: 18, rotate: 2.5 * towards, scale: 0.97 }),
        center: { opacity: 1, y: 0, rotate: step % 2 ? 0.8 : -0.9, scale: 1 },
        exit: (towards: number) => ({ opacity: 0, y: -10, rotate: -2 * towards, scale: 0.98 }),
      }
  /** Shared by the sheet and the print: enter from the side we travel towards, leave by the other. */
  const swapMotion = { custom: direction, initial: 'enter', animate: 'center', exit: 'exit', transition: { duration: reducedMotion ? 0.2 : 0.55, ease } }

  const stickers = [...activity.manual.map((excerpt) => ({ label: excerpt.part ? `Manual · ${excerpt.part}` : 'Manual', detail: `p. ${excerpt.pages.join('–')}` })), ...(activity.worksheets ?? []).map((sheet) => ({ label: sheet.label, detail: sheet.kind === 'photo' ? 'example' : 'to print' }))]

  return (
    <GuideFrame
      label="Mockup: the facilitation guide, walking the room through the workshop"
      act={act}
      step={step}
      onSelectAct={(index) => goTo(index, 0)}
      bar={
        <>
          <span className="fac-bar-room">
            <span className="fac-hl">Community-led</span>
          </span>
          <span className="fac-clock" aria-label="Time elapsed">
            <span className="fac-clock-dot" aria-hidden="true" />
            {clock(elapsed)}
          </span>
        </>
      }
      foot={
        <>
          <span className="fac-pace">
            <span className="method-clock" aria-hidden="true" />
            about {activity.duration} min · take the time you need
          </span>
          <span className="fac-nav">
            <button type="button" className="fac-btn" onClick={() => moveTo(position - 1)} disabled={position === 0}>
              <span aria-hidden="true">←</span> Back
            </button>
            <button type="button" className="fac-btn fac-btn--primary" onClick={() => moveTo(position + 1)} disabled={isLast}>
              {isLast ? 'Complete' : "We're ready"}{' '}
              <span className="fac-btn-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </span>
        </>
      }
    >
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.article key={act} className="fac-sheet" aria-label={`${activity.name}, act ${act + 1}`} {...swapMotion} variants={sheetVariants}>
          <header className="fac-sheet-head">
            <div>
              <div className="fac-topline">
                workshop activity · {twoDigit(act + 1)} / {twoDigit(workshopActivities.length)}
              </div>
              <h3 className="fac-sheet-title">{activity.name}</h3>
              <p className="fac-sheet-subtitle">{activity.title}</p>
            </div>
            <div className="fac-stickers">
              {stickers.map((sticker, index) => (
                <motion.span key={sticker.label} className="method-taped fac-sticker" style={{ '--sticker-tilt': `${stickerTilts[index % stickerTilts.length]}deg`, '--tape-tilt': `${-stickerTilts[(index + 1) % stickerTilts.length] * 2}deg` } as CSSProperties} initial={reducedMotion ? false : { opacity: 0, y: -10, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.25 + index * 0.07, duration: 0.4, ease }}>
                  <span className="fac-sticker-label">{sticker.label}</span>
                  <span className="fac-sticker-detail">{sticker.detail}</span>
                </motion.span>
              ))}
            </div>
          </header>

          <div className="fac-columns">
            <section className="fac-guide" aria-labelledby={`fac-steps-${act}`}>
              <h4 className="fac-label" id={`fac-steps-${act}`}>
                steps
              </h4>
              <ol className="fac-steps">
                {activity.steps.map((item, index) => {
                  const state = stateOf(index, step)
                  return (
                    <li key={item.text} data-state={state}>
                      {state === 'now' && (
                        <motion.span layoutId={`fac-now-${act}`} className="fac-step-slip" aria-hidden="true" transition={motionUnlessReduced(reducedMotion)}>
                          <span className="fac-step-tape" />
                        </motion.span>
                      )}
                      <button type="button" onClick={() => goTo(act, index)} aria-current={state === 'now' ? 'step' : undefined}>
                        <span className="fac-step-num">{state === 'done' ? '✓' : twoDigit(index + 1)}</span>
                        <span className="fac-step-text">{item.text}</span>
                      </button>
                    </li>
                  )
                })}
              </ol>
              <div className="fac-prompt">
                <h4 className="fac-label">a prompt to begin</h4>
                <p>
                  <span className="fac-quote" aria-hidden="true">
                    “
                  </span>
                  {activity.prompt}
                </p>
              </div>
            </section>

            <aside className="fac-media" aria-label="Recorded example">
              <h4 className="fac-label">recorded example · step {twoDigit(step + 1)}</h4>
              <div className="fac-print-stage">
                <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                  <motion.figure key={position} className="fac-print" {...swapMotion} variants={printVariants}>
                    <div className="fac-video" data-spread={example.srcs.length > 1 ? '' : undefined}>
                      <span className="fac-video-still" role="img" aria-label={example.alt}>
                        {example.srcs.map((src) => (
                          <img key={src} src={src} alt="" style={example.focus ? { objectPosition: example.focus } : undefined} />
                        ))}
                      </span>
                      <span className="fac-video-shade" aria-hidden="true" />
                      <span className="fac-video-play" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                      </span>
                      <span className="fac-video-bar" aria-hidden="true">
                        <span className="fac-video-scrub">
                          <motion.span initial={{ width: '0%' }} animate={{ width: '34%' }} transition={{ delay: 0.3, duration: reducedMotion ? 0 : 1.2, ease }} />
                        </span>
                        <span className="fac-video-time">0:48 / {clipLengths[step % clipLengths.length]}</span>
                        <span className="fac-video-cc">CC · EN हिं मराठी</span>
                      </span>
                    </div>
                    <figcaption>{example.caption}</figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>
            </aside>
          </div>
        </motion.article>
      </AnimatePresence>
    </GuideFrame>
  )
}
