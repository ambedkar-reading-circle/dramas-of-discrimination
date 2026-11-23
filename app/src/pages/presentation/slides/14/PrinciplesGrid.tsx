const principles = [
  { title: 'Rehearsal over discussion', body: 'Change is practised, interrupted, retried.' },
  { title: 'Community ownership', body: 'The community defines safety and inclusion in its own context.' },
  { title: 'Alongside law', body: 'The work complements formal frameworks without replacing them.' },
  { title: 'The Scenario comes from the room', body: 'Groups stage the discrimination they know, not a script handed to them.' },
  { title: 'Every Failure has a name', body: 'The Actor map names each Failure so Dialogues and interventions can target it.' },
  { title: 'The pen stays local', body: 'In Local mode nothing leaves the device; Cloud mode is the community’s opt-in.' },
]

export function PrinciplesGrid() {
  return (
    <div className="slide-principles">
      <div className="slide-principles-grid">
        {principles.map((principle, index) => (
          <article className="notebook-stack slide-principle pt-row shadow-[inset_0_1px_var(--ink-faint)]" key={principle.title}>
            <span className="step-number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3>{principle.title}</h3>
            <p className="text-[1.0625rem] text-ink-soft">{principle.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
