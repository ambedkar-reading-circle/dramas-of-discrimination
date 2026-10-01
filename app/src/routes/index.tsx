import { createFileRoute } from '@tanstack/react-router'
import ArcLogo from '../components/ARCLogo'
import DodLogo from '../components/DodLogo'
import { Slab } from 'react-loading-indicators'

export const Route = createFileRoute('/')({ component: Home })
function Home() {
  return (
    <main className="page-wrap flex-1 flex-col flex items-center justify-center px-4 pb-8 pt-14">
      <div className="flex flex-col items-center justify-center p-8 gap-2">
        <Slab color="var(--hl-bg)" size="medium" text="" textColor="" />
        <p className="island-kicker">Coming soon</p>
      </div>
      <section className="island-shell rise-in px-6 py-10 sm:px-10 sm:py-14">
        <div className="font-title flex flex-col items-start justify-start">
          <div className="mb-4 w-fit">
            <ArcLogo />
          </div>
          <h1 className="dod-logo-wrapper my-4 w-auto text-[var(--sea-ink)]">
            <DodLogo />
          </h1>
          <p className="font-body max-w-2xl text-xs opacity-70 text-[var(--sea-ink-soft)]">
            Site under construction.
          </p>
        </div>
        {/*<div className="flex flex-wrap gap-3">
          <a
            href="/about"
            className="nav-btn rounded-full px-5 py-2.5 text-sm font-semibold no-underline"
          >
            About the Project
          </a>
        </div>*/}
      </section>
    </main>
  )
}
