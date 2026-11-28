import { useCallback, useEffect, useRef } from 'react'
import { slides } from './slides'
import MarkButton, { Mark } from '#/components/MarkButton'
import { useFullscreen } from './hooks/useFullscreen'
import { deckPoints, usePresentationDeck } from './hooks/usePresentationDeck'
import SlideNav from './components/SlideNav'
import SlideStage from './components/SlideStage'
import { controlSelector, plainKey, pressedOn } from './keyTargets'
import { PlaybackContext, usePlaybackState } from './playback/playback'
import { slideLabel } from './slideLabel'
import './PresentationDeck.css'
import { twoDigit } from '#/lib/format'
import { useLatest } from '#/lib/use-latest'

export default function PresentationDeck() {
  const position = usePresentationDeck()
  const { slide, point, total, goTo, onDeckKeyDown, stageSwipeHandlers, initialSwitches, rememberPlayback } = position
  const current = slides[slide - 1]
  const playback = usePlaybackState({ slide, point, slideId: current.id, points: deckPoints[slide - 1], atEnd: position.atEnd, next: position.next, goTo }, initialSwitches)
  useEffect(() => rememberPlayback({ play: playback.playing, voice: playback.voice }), [rememberPlayback, playback.playing, playback.voice])
  const deck = useRef<HTMLElement>(null)

  const notebook = useCallback(() => deck.current?.closest<HTMLElement>('.notebook-surface') ?? null, [])
  // The notebook surface already carries the ruling, margin guides, and pencil.
  // Fullscreening the deck alone would leave those layers behind.
  const { fullscreen, toggle: toggleFullscreen } = useFullscreen(notebook)

  // Space plays and pauses, as on any player; held down, it does so once. Space on a control still works that control.
  const onKeyDown = useLatest((event: KeyboardEvent) => {
    if (event.key === ' ' && plainKey(event) && !pressedOn(event, controlSelector)) {
      event.preventDefault()
      if (!event.repeat) playback.toggle()
      return
    }
    onDeckKeyDown(event)
  })

  // The keys are heard on the document, not the deck: a click on a slide's
  // empty space focuses the <main> around it, and on load focus is on the
  // page itself, and the keys must work from both. A key press anywhere else
  // (the site header) is left alone. Handlers inside the deck run first, so a
  // key they stop or prevent never gets here.
  useEffect(() => {
    const listen = (event: KeyboardEvent) => {
      const surface = notebook()
      const here = event.target === document.body || (event.target instanceof Node && surface?.contains(event.target) === true)
      if (here) onKeyDown.current(event)
    }
    document.addEventListener('keydown', listen)
    return () => document.removeEventListener('keydown', listen)
  }, [onKeyDown, notebook])

  return (
    <PlaybackContext value={playback}>
    <section ref={deck} className="presentation-deck page-wrap" {...stageSwipeHandlers}>
      <header className="presentation-meta">
        <p className="eyebrow" title={current.ownsHeading ? undefined : current.kicker}>
          <span>
            {twoDigit(slide)} / {twoDigit(total)}
          </span>
          {current.ownsHeading ? null : <> {current.kicker}</>}
        </p>
      </header>

      <SlideStage slide={current} index={slide} total={total} />

      <SlideNav slides={slides} deck={position} onSelect={goTo} tools={<MarkButton label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} pressed={fullscreen} onClick={toggleFullscreen} mark={fullscreen ? <ExitFullscreenMark /> : <FullscreenMark />} />} />

      <p className="slide-sr" aria-live="polite">
        {slideLabel(slide, current.heading, ` of ${total}`)}
      </p>
    </section>
    </PlaybackContext>
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
