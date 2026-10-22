import type { ReactElement } from 'react'

function IntroTime() {
  return (
    <>
      <path d="M28 23h115v53H72L48 94V76H28Z" />
      <path d="M105 48h105v50h-26l-2 18-23-18h-54" />
      <path d="M45 41h69M45 51h83M45 61h48M161 67h30M156 78h35" />
      <circle cx="128" cy="100" r="5" />
      <path d="M117 117c0-15 22-15 22 0" />
    </>
  )
}

function PartTime() {
  return (
    <>
      <path strokeDasharray="3 5" d="m120 65-76-34m76 34 72-37m-72 37-66 43m66-43 77 42M44 31l10 77m138-80 5 79" />
      {[
        [120, 65],
        [44, 31],
        [192, 28],
        [54, 108],
        [197, 107],
      ].map(([x, y], n) => (
        <g key={n}>
          <circle cx={x} cy={y} r={n === 0 ? 23 : 17} fill="var(--activity-paper)" />
          <circle cx={x} cy={y - 4} r="4" />
          <path d={`M${x - 8} ${y + 8}c0-12 16-12 16 0`} />
        </g>
      ))}
    </>
  )
}

function StoryTime() {
  return (
    <>
      <path d="m48 27 133-13 8 100-133 9Z" />
      <path d="M62 17h130v97H62Z" fill="var(--activity-paper)" />
      <path d="M77 35h33M77 49h98M77 58h81M77 78h24M77 91h98M77 100h65" />
      <path d="m181 99 25-46 8 5-25 46-10 9Z" fill="var(--activity-paper)" />
      <path d="m204 57 8 5" />
    </>
  )
}

function PlayTime() {
  return (
    <>
      <path d="M30 17h180v99H30ZM30 29h180M48 29v72m144-72v72M21 116h198" />
      <path d="m106 44 38 22-38 22Z" />
      <path d="M69 87a16 16 0 1 0 7 13m-7-13 1 11-11-2" />
      <path d="M48 29c-2 22-6 33-18 40m162-40c2 22 6 33 18 40" />
    </>
  )
}

function OverTime() {
  return (
    <>
      <path d="M68 32c-29 36-5 80 39 80 46 0 66-55 32-83-15-12-36-14-52-4M68 32l2-19m-2 19 20 1" />
      <path d="m91 65 15 15 28-32" />
      <path d="M162 42h49M172 57h39M169 72h42M161 87h50" strokeDasharray="2 4" />
    </>
  )
}

const drawings: Record<string, () => ReactElement> = {
  IntroTime,
  PartTime,
  StoryTime,
  PlayTime,
  OverTime,
}

/** Printed diagrams share the ink and paper of the activity sheet. */
export function ActivityDrawing({ name }: { name: string }) {
  const Drawing = drawings[name]
  return (
    <svg className="method-drawing" viewBox="0 0 240 130" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {Drawing ? <Drawing /> : null}
    </svg>
  )
}
