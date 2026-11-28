import { createFileRoute } from '@tanstack/react-router'
import NotebookSurface from '#/components/NotebookSurface'
import PresentationDeck from '#/pages/presentation'
import type { PlaybackSwitches } from '#/pages/presentation/playback/switches'

export const Route = createFileRoute('/approach')({
  validateSearch: (search: Record<string, unknown>): { slide: number; point?: number } & Partial<PlaybackSwitches> => {
    const play = onOff(search.play)
    const voice = onOff(search.voice)
    return {
      slide: typeof search.slide === 'number' ? search.slide : 1,
      ...(typeof search.point === 'number' ? { point: search.point } : {}),
      ...(play === undefined ? {} : { play }),
      ...(voice === undefined ? {} : { voice }),
    }
  },
  head: () => ({
    title: 'Approach — Dramas of Discrimination',
    meta: [{ name: 'description', content: 'The Dramas of Discrimination workshop, presented as an interactive deck.' }],
  }),
  component: Approach,
})

function onOff(value: unknown): boolean | undefined {
  if (value === true || value === 'true' || value === 1 || value === '1') return true
  if (value === false || value === 'false' || value === 0 || value === '0') return false
  return undefined
}

function Approach() {
  return (
    <NotebookSurface as="main" id="main-content" className="content-page" tabIndex={-1}>
      <PresentationDeck />
    </NotebookSurface>
  )
}
