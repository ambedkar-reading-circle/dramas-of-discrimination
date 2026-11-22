const principles = [
  {
    title: 'Rehearsal over discussion',
    body: 'Change is practised, interrupted, retried.',
  },
  {
    title: 'Community ownership',
    body: 'The community defines safety and inclusion in its own context.',
  },
  {
    title: 'Alongside law',
    body: 'The work complements formal frameworks without replacing them.',
  },
]

export default function AboutPrinciples() {
  return (
    <section className="notebook-section page-wrap shadow-[inset_0_1px_var(--ink-faint)]">
      <div className="section-lede">
        <p className="eyebrow">
          <span>04 /</span> Our principles
        </p>
        <h2>The community holds the pen.</h2>
      </div>
      <p>Fraternity is only another name for democracy, Dr Ambedkar said in 1949. These principles keep the pen in the community's hands.</p>
      <div className="mt-[calc(2*var(--notebook-row))] grid grid-cols-3 gap-gutter items-start max-lg:grid-cols-1 max-lg:gap-row">
        {principles.map((principle, index) => (
          <article className="notebook-stack pt-row shadow-[inset_0_1px_var(--ink-faint)] max-lg:grid-cols-[3rem_1fr_1.3fr] max-lg:items-start max-md:grid-cols-1" key={principle.title}>
            <span className="step-number" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3>{principle.title}</h3>
            <p className="text-[1.0625rem] text-ink-soft">{principle.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
