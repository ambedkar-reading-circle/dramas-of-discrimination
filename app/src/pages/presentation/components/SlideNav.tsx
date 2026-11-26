import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { Slide } from '../types'
import { motion } from 'motion/react'
import type { Transition } from 'motion/react'
import MarkButton, { Mark, MarkGlyph } from '#/components/MarkButton'
import { usePlayback } from '../playback/playback'
import { canSpeak } from '../playback/speech'
import Captions from './Captions'
import PageStrip, { PageChip, slideLabel } from './PageStrip'
import type { CurrentPage } from './PageStrip'

interface SlideNavProps {
  slides: ReadonlyArray<Slide>
  slide: number
  total: number
  next: () => void
  prev: () => void
  onSelect: (slide: number) => void
  /** Deck tools that always sit at the bar's right end, such as fullscreen. */
  tools?: ReactNode
}

/**
 * The deck's player, docked across the bottom of the window like a music
 * player's: the transport (previous, play/pause, next) on the left; across
 * the middle, the current slide's number and its caption while captions
 * play, or else every slide's number to jump to; and on the right the caption and voice
 * switches, then the deck's tools (fullscreen). In self-facilitation the
 * current slide's number carries the step it is in.
 * The progress line runs along its top edge.
 */
export default function SlideNav({ slides, slide, total, next, prev, onSelect, tools }: SlideNavProps) {
  const playback = usePlayback()
  const selfMode = playback?.selfMode === true
  const bar = useRef<HTMLDivElement>(null)

  // The bar floats over the bottom of the window, so the deck keeps room for
  // it: its height, as a custom property, whatever the caption wraps to.
  useLayoutEffect(() => {
    const element = bar.current
    const deck = element?.closest<HTMLElement>('.presentation-deck')
    if (!element || !deck) return
    const measure = () => deck.style.setProperty('--player-height', `${element.offsetHeight}px`)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => {
      observer.disconnect()
      deck.style.removeProperty('--player-height')
    }
  }, [])

  const captioning = selfMode && playback.captions
  // In self-facilitation the current slide's number also carries the step the
  // slide is in (4.2: slide 4, second state), so no separate readout is needed.
  const steps = selfMode ? { now: playback.current.step, of: playback.beats.at(-1)?.step ?? 1 } : null
  const currentPage: CurrentPage = steps ? { label: `${slide}.${steps.now}`, note: `, step ${steps.now} of ${steps.of}` } : { label: String(slide), note: '' }

  return (
    <div ref={bar} className="slide-nav">
      <DeckProgress slide={slide} total={total} />
      <div className="slide-nav-controls">
        <nav className="slide-nav-change" aria-label="Change slides">
        <div className="slide-transport">
          <MarkButton label="Previous slide" disabled={slide <= 1} onClick={prev} mark={<MarkGlyph>←</MarkGlyph>} />
          {playback && <MarkButton label={playback.playing ? 'Pause' : 'Play the deck with captions'} className="slide-play" onClick={playback.toggle} mark={playback.playing ? <PauseMark /> : <PlayMark />} />}
          <MarkButton label="Next slide" disabled={slide >= total} onClick={next} mark={<MarkGlyph>→</MarkGlyph>} />
        </div>
        </nav>
        {captioning ? (
          // The current slide stays in view beside the caption; pressing it puts
          // the caption away and brings back every slide's number.
          <div className="slide-nav-captioned">
            <PageChip current aria-label={`${slideLabel(slide, slides[slide - 1].heading, ` of ${total}${currentPage.note}`)}. Hide captions to show all slides`} title="Slide . step: each step is something the slide opens, switches or plays" onClick={() => playback.setCaptions(false)}>
              {currentPage.label}
            </PageChip>
            <Captions />
          </div>
        ) : (
          <PageStrip slides={slides} slide={slide} onSelect={onSelect} current={currentPage} />
        )}
        <div className="slide-nav-extras">
          {playback && selfMode && (
            <>
              <MarkButton label="Captions" pressed={playback.captions} onClick={() => playback.setCaptions(!playback.captions)} mark={<CaptionsMark />} />
              {canSpeak && <MarkButton label="Read captions aloud" pressed={playback.voice} onClick={() => playback.setVoice(!playback.voice)} mark={<VoiceMark on={playback.voice} />} />}
            </>
          )}
          {tools}
        </div>
      </div>
      <CaptionTime />
    </div>
  )
}

/**
 * The current caption's own time, along the bar's bottom edge: it fills
 * across the caption's hold and starts over with the next. The voice and the
 * film set their own pace, so it stays empty for them, and while paused.
 */
function CaptionTime() {
  const playback = usePlayback()
  if (!playback?.selfMode) return null
  const { current, holdRunning, token } = playback
  return (
    <div className="caption-time" aria-hidden="true">
      <motion.div key={token} className="caption-time-fill" initial={{ scaleX: 0 }} animate={{ scaleX: holdRunning ? 1 : 0 }} transition={holdTransition(holdRunning, current.holdMs)} />
    </div>
  )
}

/**
 * How far through the deck we are. In self-facilitation it also runs through
 * each slide's captions, filling across a caption's hold as it plays, the way a
 * music player's line runs through a track.
 */
function DeckProgress({ slide, total }: { slide: number; total: number }) {
  const playback = usePlayback()
  const percent = (part: number) => `${(part / total) * 100}%`
  if (!playback?.selfMode) {
    return (
      <div className="slide-progress" aria-hidden="true">
        <div className="slide-progress-fill" style={{ inlineSize: percent(slide) }} />
      </div>
    )
  }
  const { beat, beats, current, holdRunning, token } = playback
  const from = percent(slide - 1 + beat / beats.length)
  const to = percent(slide - 1 + (beat + 1) / beats.length)
  // The voice and the film set their own pace, so the line waits at the caption's start.
  return (
    <div className="slide-progress" aria-hidden="true">
      <motion.div key={token} className="slide-progress-fill slide-progress-fill--beats" initial={{ width: from }} animate={{ width: holdRunning ? to : from }} transition={holdTransition(holdRunning, current.holdMs)} />
    </div>
  )
}

/** A line that runs across a caption's hold while it plays, and settles quickly otherwise. */
function holdTransition(running: boolean, holdMs: number): Transition {
  return running ? { duration: holdMs / 1000, ease: 'linear' } : { duration: 0.2 }
}

function PlayMark() {
  return (
    <Mark>
      <path d="M5 3.25v9.5L12.5 8z" />
    </Mark>
  )
}

function PauseMark() {
  return (
    <Mark>
      <path d="M5.5 3.5v9M10.5 3.5v9" />
    </Mark>
  )
}

/** "CC" in a frame: closed captions. */
function CaptionsMark() {
  return (
    <Mark>
      <rect x="1.75" y="3.5" width="12.5" height="9" rx="1" />
      <path d="M7 6.75a1.75 1.75 0 1 0 0 2.5M11.5 6.75a1.75 1.75 0 1 0 0 2.5" />
    </Mark>
  )
}

function VoiceMark({ on }: { on: boolean }) {
  return (
    <Mark>
      <path d="M2.5 6v4h2.5l3.5 3V3L5 6z" />
      {on ? <path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.75 3.75a6 6 0 0 1 0 8.5" /> : <path d="m11 6 3 4M14 6l-3 4" />}
    </Mark>
  )
}
