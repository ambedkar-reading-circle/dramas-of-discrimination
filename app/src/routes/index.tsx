import { createFileRoute } from '@tanstack/react-router'
import NotebookSurface from '#/components/NotebookSurface'
import CommunityInvitation from '#/pages/home/CommunityInvitation'
import FitSectionButton from '#/pages/home/FitSectionButton'
import HomeHero from '#/pages/home/HomeHero'
import ManualFlipbookSection from '#/pages/home/ManualFlipbookSection'
import TabletVideoSection from '#/pages/home/TabletVideoSection'
import WorkshopMethod from '#/pages/home/workshop-method'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <NotebookSurface as="main" id="main-content" className="landing-page" tabIndex={-1}>
      <HomeHero />
      <TabletVideoSection />
      <ManualFlipbookSection />
      <div>
        <WorkshopMethod />
        <CommunityInvitation />
      </div>
      <FitSectionButton />
    </NotebookSurface>
  )
}
