import { splitSectionClasses } from './splitSectionClasses'
import NotebookSurface from '#/components/NotebookSurface'

export default function WorkshopRationale() {
  return (
    <NotebookSurface as="section" tone="inverse">
      <div className={splitSectionClasses}>
        <div className="notebook-stack">
          <p className="eyebrow">
            <span className="text-inherit">02 /</span> Why it exists
          </p>
          <h2>A life of contradictions.</h2>
        </div>
        <div className="notebook-stack text-[1.125rem]">
          <p className="max-w-[65ch]">On 25 November 1949, Dr Ambedkar told the Constituent Assembly that India was about to enter 'a life of contradictions': equality in politics, inequality in social and economic life. One person, one vote; not yet one person, one value.</p>
          <p className="max-w-[65ch]">The Constitution abolished caste in law. A law can name a violation, identify a violator, and prescribe a penalty. What it cannot do is make a community the author of its own inclusion. Without fraternity, he warned, equality is no deeper than coats of paint.</p>
          <p className="max-w-[65ch]">That is the work of the room. Participants map the system, step into the scene, and try interventions where it is safe to fail. What safety and inclusion mean in their context is decided by them, not by us.</p>
        </div>
      </div>
    </NotebookSurface>
  )
}
