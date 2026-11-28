import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Slide } from '../types'
import type { DeckPosition } from '../hooks/usePresentationDeck'
import { motion } from 'motion/react'
import type { Transition } from 'motion/react'
import MarkButton, { Mark, MarkGlyph } from '#/components/MarkButton'
import { revealKeep } from '#/components/Reveal'
import { bindHeightVariable } from '#/lib/observe-resize'
import { usePlayback } from '../playback/playback'
import { canSpeak } from '../playback/speech'
import Captions from './Captions'
import { slideLabel } from '../slideLabel'
import PageStrip, { PageChip } from './PageStrip'
import type { CurrentPage } from './PageStrip'

interface SlideNavProps {
  slides: ReadonlyArray<Slide>
  deck: Pick<DeckPosition, 'slide' | 'point' | 'total' | 'atStart' | 'atEnd' | 'next' | 'prev'>
  onSelect: (slide: number) => void
  tools?: ReactNode
}

export default function SlideNav({ slides, deck, onSelect, tools }: SlideNavProps) {
  const { slide, point, total } = deck
  const playback = usePlayback()
  const bar = useRef<HTMLDivElement>(null)
  const [focusStrip, setFocusStrip] = useState(false)

  useLayoutEffect(() => {
    const element = bar.current
    const shell = element?.closest<HTMLElement>('.presentation-deck')
    if (!element || !shell) return
    return bindHeightVariable(element, shell, '--player-height')
  }, [])

  const captioning = playback?.captions === true
  const points = playback?.points.length ?? 1
  const currentPage: CurrentPage = { label: `${slide}.${point}`, note: `, point ${point} of ${points}` }

  return (
    <div ref={bar} className="slide-nav paper-tear paper-tear--top" {...revealKeep}>
      <div className="paper-tear__surface" aria-hidden="true" />
      <DeckProgress slide={slide} point={point} total={total} />
      <div className="slide-nav-controls">
        <nav className="slide-nav-change" aria-label="Change slides">
        <div className="slide-transport">
          <MarkButton label="Previous point" title="Previous point (←)" disabled={deck.atStart} onClick={deck.prev} mark={<MarkGlyph>←</MarkGlyph>} />
          {playback && <MarkButton {...(playback.playing ? pauseButton : playButton)} className="slide-play" onClick={playback.toggle} />}
          <MarkButton label="Next point" title="Next point (→)" disabled={deck.atEnd} onClick={deck.next} mark={<MarkGlyph>→</MarkGlyph>} />
        </div>
        </nav>
        {captioning ? (
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
              <MarkButton label="Captions" title={playback.captions ? 'Hide captions' : 'Show captions'} pressed={playback.captions} onClick={() => {
                  setFocusStrip(false)
                  playback.setCaptions(!playback.captions)
                }} mark={<CaptionsMark />} />
              {canSpeak && <MarkButton label="Read captions aloud" title={playback.voice ? 'Stop reading captions aloud' : 'Read captions aloud'} pressed={playback.voice} onClick={() => playback.setVoice(!playback.voice)} mark={<VoiceMark on={playback.voice} />} />}
            </>
          )}
          {tools}
        </div>
      </div>
      <CaptionTime />
    </div>
  )
}

const playButton = { label: 'Play the deck with captions', title: 'Play (Space)', mark: <PlayMark /> }
const pauseButton = { label: 'Pause', title: 'Pause (Space)', mark: <PauseMark /> }

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
  const at = (done: number) => percent(slide - 1 + (point - 1 + done / current.captions.length) / points.length)
  const from = at(captionIndex)
  const to = at(captionIndex + 1)
  return (
    <div className="slide-progress" aria-hidden="true">
      <motion.div key={captionsApplied} className="slide-progress-fill slide-progress-fill--points" initial={{ width: from }} animate={{ width: runningMs !== null ? to : from }} transition={runTransition(runningMs)} />
    </div>
  )
}

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
