import { useCallback, useRef } from 'react'
import { offsetToNextRule, useNotebookRuleAlign } from '#/lib/notebook-align'
import { splitSectionClasses } from './content/splitSectionClasses'
import { viewportSection } from './FitSectionButton'

export default function CommunityInvitation() {
  const sectionRef = useRef<HTMLElement>(null)

  const alignPadding = useCallback(() => {
    const section = sectionRef.current
    const paper = section?.closest<HTMLElement>('.notebook-surface')
    if (!section || !paper) return
    const row = parseFloat(getComputedStyle(section).lineHeight)
    const start = section.getBoundingClientRect().top - paper.getBoundingClientRect().top
    section.style.setProperty('--community-rule-offset', `${offsetToNextRule(start, row)}px`)
  }, [])

  const observePadding = useCallback(() => {
    const section = sectionRef.current
    const paper = section?.closest<HTMLElement>('.notebook-surface')
    if (!section || !paper) return []
    return [paper, section, section.previousElementSibling]
  }, [])

  useNotebookRuleAlign(observePadding, alignPadding)

  return (
    <section {...viewportSection} ref={sectionRef} className={`${splitSectionClasses} shadow-[inset_0_1px_var(--ink-faint)]`} style={{ paddingTop: 'calc(var(--notebook-section-space) + var(--community-rule-offset, 0px))' }}>
      <div className="notebook-stack">
        <p className="eyebrow">Bring it to your community</p>
        <h2>Run the workshop in your community.</h2>
      </div>
      <div className="notebook-stack justify-items-start">
        <p className="max-w-[65ch] text-ink-soft">We are building the facilitation app in the open, and it is not ready yet. The worksheets already are. Start with a scenario your group knows too well, and see where the rehearsal leads.</p>
      </div>
    </section>
  )
}
