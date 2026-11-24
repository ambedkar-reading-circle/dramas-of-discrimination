import { contributors } from './content/contributors'

export default function TeamContributors() {
  return (
    <section className="notebook-section page-wrap">
      <div className="section-lede">
        <p className="eyebrow">Contributors</p>
      </div>
      <div className="grid grid-cols-3 gap-x-gutter gap-y-row items-start max-lg:grid-cols-1 max-lg:gap-row">
        {contributors.map((contributor) => (
          <article key={contributor.id} className="notebook-stack">
            <h3 className="m-0">{contributor.name}</h3>
            <p className="text-[0.875rem] text-ink-soft">{contributor.role}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
