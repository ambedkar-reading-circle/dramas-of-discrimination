import type { ReactNode } from 'react'

const workshops = ['Workplace · Pune', 'College · Delhi', 'NGO · Nagpur', 'Workplace · Bengaluru', 'Community · Mumbai', 'School · Hyderabad']

const panel = 'grid content-start rounded-sm p-3 text-sm inset-ring inset-ring-ink-faint'
const caption = 'm-0 text-[0.8125rem] text-ink-soft'

/** A bare app window, a title bar over a body, standing in for a screen still to be designed. */
function MockWindow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid grid-rows-[auto_1fr] overflow-hidden rounded-md bg-(--ink-scrim) inset-ring inset-ring-line">
      <div className="flex items-center gap-1.5 px-3 py-2 text-xs text-ink-soft shadow-[inset_0_-1px_0_var(--ink-faint)]">
        <span className="mr-6 flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-2 rounded-full bg-ink-faint" />
          ))}
        </span>
        {title}
      </div>
      <div className="grid gap-3 p-3">{children}</div>
    </div>
  )
}

/** Grey lines standing in for text, each as wide as the given percentage. */
function MockLines({ widths }: { widths: ReadonlyArray<number> }) {
  return widths.map((width, index) => <div key={index} className="h-2 rounded-full bg-ink-faint" style={{ width: `${width}%` }} />)
}

/** Placeholder: a generated Manifesto beside the repository of Manifestos. */
export function ManifestoMockup() {
  return (
    <div className="mx-auto grid w-full max-w-[60rem] grid-cols-1 gap-gutter min-[701px]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" role="img" aria-label="Mockup: a generated Manifesto of Inclusion beside the repository of Manifestos">
      <MockWindow title="Manifesto of Inclusion">
        <div className={`${panel} gap-2.5 p-5`}>
          <h3 className="m-0 text-[0.9375rem]">We, the Community, commit to…</h3>
          <MockLines widths={[95, 85, 90, 60]} />
          <MockLines widths={[90, 80, 70]} />
          <p className={caption}>Generated from every Group’s submitted Rehearsal</p>
        </div>
      </MockWindow>
      <MockWindow title="Repository · all Manifestos">
        <div className="grid grid-cols-3 gap-2">
          {workshops.map((workshop) => (
            <div className={`${panel} gap-1.5`} key={workshop}>
              <span className={caption}>{workshop}</span>
              <MockLines widths={[90, 70, 80]} />
            </div>
          ))}
        </div>
      </MockWindow>
    </div>
  )
}
