import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Slide } from '../types'
import type { DeckPosition } from '../hooks/usePresentationDeck'
import { motion } from 'motion/react'
import type { Transition } from 'motion/react'
import MarkButton, { Mark, MarkGlyph } from '#/components/MarkButton'
import { revealKeep } from '#/components/Reveal'
import { usePlayback } from '../playback/playback'
import { canSpeak } from '../playback/speech'
import Captions from './Captions'
import PageStrip, { PageChip, slideLabel } from './PageStrip'
import type { CurrentPage } from './PageStrip'

interface SlideNavProps {
  slides: ReadonlyArray<Slide>
  /** Where the deck is, and the arrows that step it one point. */
  deck: Pick<DeckPosition, 'slide' | 'point' | 'total' | 'atStart' | 'atEnd' | 'next' | 'prev'>
  onSelect: (slide: number) => void
  /** Deck tools that always sit at the bar's right end, such as fullscreen. */
  tools?: ReactNode
}

/**
 * The deck's player, docked across the bottom of the window like a music
 * player's: the transport (previous, play/pause, next) on the left; across
 * the middle, the current slide's number and its caption while captions
 * are on (from arrival, played or not), or else every slide's number to jump to; and on the right the caption and voice
 * switches, then the deck's tools (fullscreen). The current slide's number
 * carries the point of its speaker notes the deck is on (4.3), and the
 * arrows step from point to point. The progress line runs along its top edge.
 */
export default function SlideNav({ slides, deck, onSelect, tools }: SlideNavProps) {
  const { slide, point, total } = deck
  const playback = usePlayback()
  const bar = useRef<HTMLDivElement>(null)
  // Hiding captions from the current slide's square removes that square, so focus moves to its place in the strip.
  const [focusStrip, setFocusStrip] = useState(false)

  // The bar floats over the bottom of the window, so the deck keeps room for
  // it: its height, as a custom property, whatever the caption wraps to.
  useLayoutEffect(() => {
    const element = bar.current
    const shell = element?.closest<HTMLElement>('.presentation-deck')
    if (!element || !shell) return
    const measure = () => shell.style.setProperty('--player-height', `${element.offsetHeight}px`)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => {
      observer.disconnect()
      shell.style.removeProperty('--player-height')
    }
  }, [])

  const captioning = playback?.captions === true
  // The current slide's number carries its point (4.3: slide 4, third point), so no separate readout is needed.
  const points = playback?.points.length ?? 1
  const currentPage: CurrentPage = { label: `${slide}.${point}`, note: `, point ${point} of ${points}` }

  return (
    // A press on the player must not close the slide's photo: the point it moves to decides that.
    <div ref={bar} className="slide-nav" {...revealKeep}>
      <DeckProgress slide={slide} point={point} total={total} />
      <div className="slide-nav-controls">
        <nav className="slide-nav-change" aria-label="Change slides">
        <div className="slide-transport">
          <MarkButton label="Previous point" disabled={deck.atStart} onClick={deck.prev} mark={<MarkGlyph>←</MarkGlyph>} />
          {playback && <MarkButton label={playback.playing ? 'Pause' : 'Play the deck with captions'} className="slide-play" onClick={playback.toggle} mark={playback.playing ? <PauseMark /> : <PlayMark />} />}
          <MarkButton label="Next point" disabled={deck.atEnd} onClick={deck.next} mark={<MarkGlyph>→</MarkGlyph>} />
        </div>
        </nav>
        {captioning ? (
          // The current slide stays in view beside the caption; pressing it puts
          // the caption away and brings back every slide's number.
          <div className="slide-nav-captioned">
            <PageChip current aria-label={`${slideLabel(slide, slides[slide - 1].heading, ` of ${total}${currentPage.note}`)}. Hide captions to show all slides`} title="Slide . point: each point is one entry of the slide's speaker notes" onClick={() => {
                setFocusStrip(true)
                playback.setCaptions(false)
              }}>
              {currentPage.label}
            </PageChip>
            <Captions />
          </div>
        ) : (
          <PageStrip slides={slides} slide={slide} onSelect={onSelect} current={currentPage} focusOnMount={focusStrip} />
        )}
        <div className="slide-nav-extras">
          {playback && (
            <>
              <MarkButton label="Captions" pressed={playback.captions} onClick={() => {
                  setFocusStrip(false)
                  playback.setCaptions(!playback.captions)
                }} mark={<CaptionsMark />} />
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
 * across the caption's length and starts over with the next. A pace whose
 * length is not known ahead (the browser's voice, the film) leaves it empty,
 * as does a point whose captions have run.
 */
function CaptionTime() {
  const playback = usePlayback()
  if (!playback) return null
  const { runningMs, captionsApplied } = playback
  return (
    <div className="caption-time" aria-hidden="true">
      <motion.div key={captionsApplied} className="caption-time-fill" initial={{ scaleX: 0 }} animate={{ scaleX: runningMs !== null ? 1 : 0 }} transition={runTransition(runningMs)} />
    </div>
  )
}

/**
 * How far through the deck we are: through the slides, and within a slide
 * through its points. While playing it fills across each caption's hold, the
 * way a music player's line runs through a track.
 */
function DeckProgress({ slide, point, total }: { slide: number; point: number; total: number }) {
  const playback = usePlayback()
  const percent = (part: number) => `${(part / total) * 100}%`
  if (!playback) {
    return (
      <div className="slide-progress" aria-hidden="true">
        <div className="slide-progress-fill" style={{ inlineSize: percent(slide) }} />
      </div>
    )
  }
  const { points, current, captionIndex, runningMs, captionsApplied } = playback
  // A point's captions share its stretch of the line.
  const at = (done: number) => percent(slide - 1 + (point - 1 + done / current.captions.length) / points.length)
  const from = at(captionIndex)
  const to = at(captionIndex + 1)
  // A pace of unknown length (the browser's voice, the film) leaves the line at the caption's start.
  return (
    <div className="slide-progress" aria-hidden="true">
      <motion.div key={captionsApplied} className="slide-progress-fill slide-progress-fill--points" initial={{ width: from }} animate={{ width: runningMs !== null ? to : from }} transition={runTransition(runningMs)} />
    </div>
  )
}

/** A line that runs across a caption's length while it plays, and settles quickly otherwise. */
function runTransition(runningMs: number | null): Transition {
  return runningMs !== null ? { duration: runningMs / 1000, ease: 'linear' } : { duration: 0.2 }
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
