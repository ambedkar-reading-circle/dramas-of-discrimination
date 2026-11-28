import { AnimatePresence, motion } from 'motion/react'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { usePlayback } from '../playback/playback'

/**
 * The middle of the player while captions are on: the current caption,
 * framed like the buttons. While the slide carries a point alone, such as the
 * film on slide 02, it says so, and how to start it when the deck is not playing.
 */
export default function Captions() {
  const playback = usePlayback()
  const reduced = usePrefersReducedMotion()
  if (!playback) return null
  const film = playback.current.wait === 'film'
  const filmNote = playback.playing ? 'The film is playing. The captions pick up when it ends.' : 'Press play to watch the film, or step on past it.'
  const text = film ? filmNote : playback.caption.say

  return (
    <div className="deck-captions" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {text !== '' && (
          <motion.p key={text} className="deck-caption" data-kind={film ? 'quiet' : 'caption'} initial={{ opacity: 0, y: reduced ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -4 }} transition={{ duration: reduced ? 0.15 : 0.25 }}>
            {text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
