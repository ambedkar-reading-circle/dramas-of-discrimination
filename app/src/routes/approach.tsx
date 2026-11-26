import { createFileRoute } from '@tanstack/react-router'
import NotebookSurface from '#/components/NotebookSurface'
import PresentationDeck from '#/pages/presentation'

export const Route = createFileRoute('/approach')({
  // Keep the presenter's place across refresh and deep links: /approach?slide=7
  // ?play=1 opens the deck in self-facilitation, already playing.
  validateSearch: (search: Record<string, unknown>): { slide: number; play?: true } => ({
    slide: typeof search.slide === 'number' ? search.slide : 1,
    ...(search.play === 1 || search.play === true || search.play === '1' ? { play: true as const } : {}),
  }),
  head: () => ({
    title: 'Approach — Dramas of Discrimination',
    meta: [{ name: 'description', content: 'The Dramas of Discrimination workshop, presented as an interactive deck.' }],
  }),
  component: Approach,
})

function Approach() {
  return (
    <NotebookSurface as="main" id="main-content" className="content-page" tabIndex={-1}>
      <PresentationDeck />
    </NotebookSurface>
  )
}
