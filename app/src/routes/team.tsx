import { createFileRoute } from '@tanstack/react-router'
import NotebookSurface from '#/components/NotebookSurface'
import TeamHero from '#/pages/team/TeamHero'
import TeamJoinNote from '#/pages/team/TeamJoinNote'
import TeamRoster from '#/pages/team/TeamRoster'

export const Route = createFileRoute('/team')({
  component: Team,
})

function Team() {
  return (
    <NotebookSurface as="main" id="main-content" className="content-page [--notebook-section-space:calc(2*var(--notebook-row))]" tabIndex={-1}>
      <TeamHero />
      <TeamRoster />
      <TeamJoinNote />
    </NotebookSurface>
  )
}
