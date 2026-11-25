/** Each Member's device in the cloud half: two Groups, two Members each. */
const memberDevices = [
  { id: 'a1', group: 'A' },
  { id: 'a2', group: 'A' },
  { id: 'b1', group: 'B' },
  { id: 'b2', group: 'B' },
]

const screen = 'grid place-items-center rounded-md bg-(--ink-scrim) text-[0.8125rem] text-ink-soft inset-ring inset-ring-line'
const caption = 'm-0 text-[0.8125rem] text-ink-soft'

/** Placeholder: one shared screen beside a Facilitator's device linked to each Member's own. */
export function ModesMockup() {
  return (
    <div className="mx-auto grid w-full max-w-[60rem] grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))] gap-gutter" role="img" aria-label="Mockup: Local mode on one shared device, Cloud mode with each Member on their own">
      <div className="grid content-start justify-items-center gap-3 text-center">
        <h3 className="m-0 text-base">Local mode · one device</h3>
        <div className={`${screen} aspect-[4/3] w-56`}>Shared screen</div>
        <p className={caption}>The whole room gathers around one screen.</p>
      </div>
      <div className="grid content-start justify-items-center gap-3 text-center">
        <h3 className="m-0 text-base">Cloud mode · a device each</h3>
        <div className="grid justify-items-center">
          <div className={`${screen} aspect-[4/3] w-40`}>Facilitator’s device</div>
          <div className="mt-3 h-5 w-3/4 border border-b-0 border-dashed border-line" />
          <div className="flex gap-3">
            {memberDevices.map((device) => (
              <div className={`${screen} aspect-[9/16] w-[4.5rem] text-[0.6875rem]`} key={device.id}>
                Member
                <br />
                Group {device.group}
              </div>
            ))}
          </div>
        </div>
        <p className={caption}>Each Member on their own device, all in sync.</p>
      </div>
    </div>
  )
}
