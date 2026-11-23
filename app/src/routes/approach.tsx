import { createFileRoute } from '@tanstack/react-router'
import NotebookSurface from '#/components/NotebookSurface'
import PresentationDeck from '#/pages/presentation'

export const Route = createFileRoute('/approach')({
  // Keep the presenter's place across refresh and deep links: /approach?slide=7
  validateSearch: (search: Record<string, unknown>) => ({
    slide: typeof search.slide === 'number' ? search.slide : 1,
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
