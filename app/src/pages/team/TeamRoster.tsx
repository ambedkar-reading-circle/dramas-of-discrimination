import { teamMembers } from './content/teamMembers'

function memberInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

export default function TeamRoster() {
  return (
    <section className="notebook-section page-wrap">
      <div className="grid grid-cols-3 gap-x-gutter gap-y-row items-start max-lg:grid-cols-1 max-lg:gap-row">
        {teamMembers.map((member) => (
          <article key={member.id} className="notebook-stack">
            <div className="flex items-center gap-gutter">
              {member.photo ? (
                <img src={member.photo} alt={member.name} width={96} height={96} className="block h-[calc(3*var(--notebook-row))] w-[calc(3*var(--notebook-row))] object-cover shadow-[inset_0_0_0_1px_var(--line)]" />
              ) : (
                <span aria-hidden="true" className="flex h-[calc(3*var(--notebook-row))] w-[calc(3*var(--notebook-row))] items-center justify-center font-[family-name:var(--font-title)] text-[1rem] text-ink-soft shadow-[inset_0_0_0_1px_var(--line)]">
                  {memberInitials(member.name)}
                </span>
              )}
              <h3 className="m-0">{member.name}</h3>
            </div>
            <p className="text-[1.0625rem]">{member.intro}</p>
            {member.links && (
              <p className="text-[0.875rem]">
                {member.links.map((link, index) => (
                  <span key={link.href}>
                    {index > 0 && <span aria-hidden="true"> · </span>}
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="underline decoration-(--ink-faint) underline-offset-4 hover:text-ink">
                      {link.label}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
