import { createFileRoute } from '@tanstack/react-router'
import NotebookSurface from '#/components/NotebookSurface'
import TeamHero from '#/pages/about-us/TeamHero'
import TeamJoinNote from '#/pages/about-us/TeamJoinNote'
import TeamRoster from '#/pages/about-us/TeamRoster'

export const Route = createFileRoute('/about-us')({
  head: () => ({
    title: 'About Us — Dramas of Discrimination',
    meta: [{ name: 'description', content: 'The people of the Ambedkar Reading Circle who make Dramas of Discrimination.' }],
  }),
  component: AboutUs,
})

function AboutUs() {
  return (
    <NotebookSurface as="main" id="main-content" className="content-page [--notebook-section-space:calc(2*var(--notebook-row))]" tabIndex={-1}>
      <TeamHero />
      <TeamRoster />
      <TeamJoinNote />
    </NotebookSurface>
  )
}
