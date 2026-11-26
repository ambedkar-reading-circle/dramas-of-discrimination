import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { slides } from './slides'
import MarkButton, { Mark } from '#/components/MarkButton'
import { usePresentationDeck } from './hooks/usePresentationDeck'
import SlideNav from './components/SlideNav'
import SlideStage from './components/SlideStage'
import { PlaybackContext, controlSelector, usePlaybackState } from './playback/playback'
import './PresentationDeck.css'
import { twoDigit } from '#/lib/format'

export default function PresentationDeck() {
  const { slide, total, goTo, next, prev, onDeckKeyDown, stageSwipeHandlers } = usePresentationDeck()
  const current = slides[slide - 1]
  const { play: playOnOpen } = useSearch({ from: '/approach' })
  const playback = usePlaybackState({ slides, slide, goTo }, playOnOpen === true)
  const navigate = useNavigate({ from: '/approach' })
  // The URL says whether the deck is playing, so a refresh mid-playback carries on, and one after pausing stays paused.
  useEffect(() => {
    if ((playOnOpen === true) === playback.playing) return
    void navigate({ search: (search) => ({ slide: search.slide, ...(playback.playing ? { play: true as const } : {}) }), replace: true })
  }, [playOnOpen, playback.playing, navigate])
  const [fullscreen, setFullscreen] = useState(false)
  const deck = useRef<HTMLElement>(null)

  const notebook = () => deck.current?.closest<HTMLElement>('.notebook-surface') ?? null

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

  // Space plays and pauses, as on any player. In self-facilitation, Shift with
  // an arrow steps one caption. Space on a control inside a slide still works that control.
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const onControl = event.target instanceof Element && event.target.closest(controlSelector)
      if (event.key === ' ' && !onControl) {
        event.preventDefault()
        playback.toggle()
        return
      }
      if (playback.selfMode && event.shiftKey && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        event.preventDefault()
        if (event.key === 'ArrowRight') playback.nextBeat()
        else playback.prevBeat()
        return
      }
    }
    onDeckKeyDown(event)
  }

  return (
    <PlaybackContext value={playback}>
    <section ref={deck} className="presentation-deck page-wrap" onKeyDown={onKeyDown} {...stageSwipeHandlers}>
      <header className="presentation-meta">
        <p className="eyebrow" title={current.ownsHeading ? undefined : current.kicker}>
          <span>
            {twoDigit(slide)} / {twoDigit(total)}
          </span>
          {current.ownsHeading ? null : <> {current.kicker}</>}
        </p>
      </header>

      <SlideStage slide={current} index={slide} total={total} />

      <SlideNav slides={slides} slide={slide} total={total} next={next} prev={prev} onSelect={goTo} tools={<MarkButton label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} pressed={fullscreen} onClick={toggleFullscreen} mark={fullscreen ? <ExitFullscreenMark /> : <FullscreenMark />} />} />

      <p className="slide-sr" aria-live="polite">
        Slide {slide} of {total}: {current.heading}
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
