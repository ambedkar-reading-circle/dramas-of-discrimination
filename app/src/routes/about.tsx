import { createFileRoute } from '@tanstack/react-router'
import NotebookSurface from '#/components/NotebookSurface'
import AboutChapters from '#/pages/about/AboutChapters'
import AboutHero from '#/pages/about/AboutHero'
import AboutPrinciples from '#/pages/about/AboutPrinciples'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <NotebookSurface as="main" id="main-content" className="content-page" tabIndex={-1}>
      <AboutHero />
      <AboutChapters />
      <AboutPrinciples />
    </NotebookSurface>
  )
}
