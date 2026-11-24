import { useCallback, useEffect, useRef, useState } from 'react'
import { slides } from './slides'
import MarkButton, { Mark } from '#/components/MarkButton'
import { usePresentationDeck } from './hooks/usePresentationDeck'
import SlideIndex, { SlideOverviewControl } from './components/SlideIndex'
import SlideNav from './components/SlideNav'
import SpeakerNotes, { SpeakerNotesControl } from './components/SpeakerNotes'
import SlideStage from './components/SlideStage'
import type { SlideStageHandle } from './components/SlideStage'
import './PresentationDeck.css'

export default function PresentationDeck() {
  const { slide, total, goTo, next, prev, onDeckKeyDown, stageSwipeHandlers } = usePresentationDeck()
  const current = slides[slide - 1]
  const [overviewOpen, setOverviewOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const deck = useRef<HTMLElement>(null)
  const stage = useRef<SlideStageHandle>(null)
  const focusStage = useCallback(() => {
    stage.current?.focusHeading()
  }, [])

  const notebook = () => deck.current?.closest<HTMLElement>('.notebook-surface') ?? null

  const selectSlide = useCallback(
    (target: number) => {
      setOverviewOpen(false)
      goTo(target)
    },
    [goTo],
  )

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement === notebook())
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  // The notebook surface already carries the ruling, margin guides, and pencil.
  // Fullscreening the deck alone would leave those layers behind.
  const toggleFullscreen = useCallback(() => {
    const surface = notebook()
    if (!surface) return
    if (document.fullscreenElement === surface) {
      void document.exitFullscreen()
    } else {
      void surface.requestFullscreen().catch(() => {})
    }
  }, [])

  return (
    <section ref={deck} className="presentation-deck page-wrap" onKeyDown={onDeckKeyDown} {...stageSwipeHandlers}>
      <header className="presentation-meta">
        <p className="eyebrow" title={current.ownsHeading ? undefined : current.kicker}>
          <span>
            {String(slide).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          {current.ownsHeading ? null : <> {current.kicker}</>}
        </p>
        <div className="presentation-tools">
          <SpeakerNotesControl open={notesOpen} onOpen={() => setNotesOpen(true)} />
          <SlideOverviewControl open={overviewOpen} onOpen={() => setOverviewOpen(true)} />
          <MarkButton label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} pressed={fullscreen} onClick={toggleFullscreen} mark={fullscreen ? <ExitFullscreenMark /> : <FullscreenMark />} />
        </div>
      </header>

      <SlideStage ref={stage} slide={current} index={slide} total={total} />

      <SlideNav slides={slides} slide={slide} total={total} next={next} prev={prev} onSelect={goTo} onOpenOverview={() => setOverviewOpen(true)} />

      <SlideIndex slides={slides} current={slide} open={overviewOpen} onOpenChange={setOverviewOpen} onSelect={selectSlide} onFocusStage={focusStage} />

      <SpeakerNotes slide={current} open={notesOpen} onOpenChange={setNotesOpen} />

      <p className="slide-sr" aria-live="polite">
        Slide {slide} of {total}: {current.heading}
      </p>
    </section>
  )
}

function FullscreenMark() {
  return (
    <Mark>
      <path d="M6 2.5H2.5V6M10 2.5h3.5V6M13.5 10v3.5H10M2.5 10v3.5H6" />
    </Mark>
  )
}

function ExitFullscreenMark() {
  return (
    <Mark>
      <path d="M6 2.5v3.5H2.5M10 2.5v3.5h3.5M13.5 10H10v3.5M2.5 10H6v3.5" />
    </Mark>
  )
}
