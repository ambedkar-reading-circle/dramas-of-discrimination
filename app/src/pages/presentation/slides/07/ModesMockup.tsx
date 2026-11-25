import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import type { Transition } from 'motion/react'
import DodLogo from '#/components/DodLogo'
import { twoDigit } from '#/lib/format'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { workshopActivities } from '#/pages/home/workshop-method'
import { GuideJourney, motionUnlessReduced } from '../06/GuideJourney'
import '../06/FacilitationGuideMockup.css'
import { actorRows, categories, members, scenarioCell, scribe } from './content/actorMap'
import type { SheetCell, Writer } from './content/actorMap'
import { useSheetFill } from './hooks/useSheetFill'
import type { WriterAt } from './hooks/useSheetFill'
import './ModesMockup.css'

type Mode = 'local' | 'cloud'

/** PartTime, on its last step: the Group fills in the Actor map. */
const act = 1
const step = workshopActivities[act].steps.length - 1

const writersFor: Record<Mode, ReadonlyArray<Writer>> = { local: [scribe], cloud: members }

/** The mode switch's thumb snaps across quickly. */
const thumbSpring: Transition = { type: 'spring', stiffness: 380, damping: 32 }
/** A cursor glides loosely from cell to cell, the way a hand moves a mouse. */
const cursorSpring: Transition = { type: 'spring', stiffness: 150, damping: 20, mass: 0.6, opacity: { duration: 0.3 } }

const status: Record<Mode, string> = {
  local: 'Data stays on this device',
  cloud: 'Shared with the platform · live',
}

/**
 * Mockup: the facilitation guide open on PartTime's Actor map, in either mode.
 * In Local mode one cursor fills the sheet on the room's shared screen; in
 * Cloud mode every Member's cursor writes into it at once, each under their
 * own name.
 */
export function ModesMockup() {
  const [mode, setMode] = useState<Mode>('local')

  return (
    <div className="fac modes activity-surface" data-mode={mode} role="group" aria-label="Mockup: in Local mode the Actor map is filled on one device and its data stays there; in Cloud mode the data is shared with the platform and several Members fill it at once">
      <header className="fac-bar">
        <span className="fac-bar-title">
          <span aria-hidden="true">↺</span> Facilitation guide
        </span>
        <ModeSwitch mode={mode} onChange={setMode} />
        {mode === 'cloud' && <Presence />}
        <span className="modes-chip" data-mode={mode}>
          <span className="modes-chip-dot" aria-hidden="true" />
          {status[mode]}
        </span>
      </header>

      <div className="fac-screen">
        <GuideJourney act={act} step={step} />
        <div className="fac-desk">
          <article className="fac-sheet modes-sheet" aria-label="Actor map">
            {/* The journey above already names the act, so the sheet carries only its tabs. */}
            <div className="modes-tabs" aria-hidden="true">
              <span className="modes-tab">Steps</span>
              <span className="modes-tab">Example</span>
              <span className="modes-tab" data-active="">
                Actor map
              </span>
            </div>
            <ActorMapSheet key={mode} mode={mode} />
          </article>
        </div>
      </div>

      <footer className="fac-bar fac-bar--foot">
        <span className="fac-wordmark">
          <DodLogo variant="inline" />
        </span>
        <img className="fac-logo" src="/ARCLogo-blue.png" alt="Ambedkar Reading Circle" />
      </footer>
    </div>
  )
}

function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  const options: ReadonlyArray<{ value: Mode; label: string; icon: string }> = [
    { value: 'local', label: 'Local', icon: 'M3 5h18v11H3zM8 20h8M12 16v4' },
    { value: 'cloud', label: 'Cloud', icon: 'M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z' },
  ]
  return (
    <span className="modes-switch" role="group" aria-label="Mode">
      {options.map((option) => (
        <button key={option.value} type="button" aria-pressed={mode === option.value} onClick={() => onChange(option.value)}>
          {mode === option.value && <motion.span layoutId="modes-switch-thumb" className="modes-switch-thumb" transition={thumbSpring} />}
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path d={option.icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <span>{option.label}</span>
        </button>
      ))}
    </span>
  )
}

/** Every Member in the sheet, by face. */
function Presence() {
  return (
    <span className="modes-presence" aria-label={`${members.length} Members editing: ${members.map((member) => member.name).join(', ')}`}>
      <span className="modes-avatars">
        {members.map((member, index) => (
          <motion.span key={member.id} className="modes-avatar" style={{ background: member.color }} title={member.name} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.08 }}>
            {member.name[0]}
          </motion.span>
        ))}
      </span>
    </span>
  )
}

type Point = Readonly<{ x: number; y: number }>

/** The Actor map with its writers' cursors laid over it, typing it in. */
function ActorMapSheet({ mode }: { mode: Mode }) {
  const reducedMotion = usePrefersReducedMotion()
  const { typedOf, writers } = useSheetFill(writersFor[mode], reducedMotion)
  const wrap = useRef<HTMLDivElement>(null)
  const [points, setPoints] = useState<Readonly<Partial<Record<string, Point>>>>({})
  const writerOn = new Map(writers.map((at) => [at.cell, at]))

  // Follow each writer's caret. The slide may be scaled to fit, so client
  // rectangles are brought back to the sheet's own pixels.
  useLayoutEffect(() => {
    const element = wrap.current
    if (!element) return
    const box = element.getBoundingClientRect()
    const scale = box.width / element.offsetWidth || 1
    const next: Record<string, Point> = {}
    for (const { writer } of writers) {
      const caret = element.querySelector(`[data-caret="${writer.id}"]`)
      if (!caret) continue
      const rect = caret.getBoundingClientRect()
      next[writer.id] = { x: (rect.left - box.left) / scale + element.scrollLeft, y: (rect.top - box.top) / scale + element.scrollTop }
    }
    setPoints((current) =>
      Object.entries(next).every(([id, point]) => {
        const was = current[id]
        return was && Math.abs(was.x - point.x) < 0.5 && Math.abs(was.y - point.y) < 0.5
      })
        ? current
        : next,
    )
  })

  const cell = (item: SheetCell) => <Cell item={item} typed={typedOf(item.id)} at={writerOn.get(item.id)} />

  return (
    <div className="modes-sheet-body" ref={wrap}>
      <section className="modes-scenario" aria-label="Scenario">
        <span className="modes-scenario-text" {...writerMarks(writerOn.get(scenarioCell.id))}>
          {cell(scenarioCell)}
        </span>

        <ul className="modes-categories" aria-label="Categories">
          {categories.map((item) => {
            const ticked = typedOf(item.id) >= 1
            const at = writerOn.get(item.id)
            return (
              <li key={item.id} data-ticked={ticked ? '' : undefined} {...writerMarks(at)}>
                <span className="modes-box" data-caret={at?.writer.id} aria-hidden="true">
                  {ticked && (
                    <motion.svg viewBox="0 0 16 16" initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}>
                      <motion.path d="M3 8.5l3.2 3L13 4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" initial={reducedMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25 }} />
                    </motion.svg>
                  )}
                </span>
                <span>
                  {item.text}
                  <span className="sr-only">{ticked ? ', ticked' : ', not ticked'}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <table className="modes-table">
        <colgroup>
          <col className="modes-col-num" />
          <col className="modes-col-actor" />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Row</span>
            </th>
            <th scope="col">Actor</th>
            <th scope="col">Ideal behaviour</th>
            <th scope="col">Failures</th>
          </tr>
        </thead>
        <tbody>
          {actorRows.map((row, index) => (
            <tr key={row.actor.id}>
              <td className="modes-num">{twoDigit(index + 1)}</td>
              {[row.actor, row.ideal, row.failures].map((item) => (
                <td key={item.id} {...writerMarks(writerOn.get(item.id))}>
                  {cell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="modes-cursors" aria-hidden="true">
        {writers.map(({ writer, phase }) => {
          const caret = points[writer.id]
          if (!caret) return null
          // A writer who is done drifts off their last word, fades back and lowers their flag.
          const point = phase === 'idle' ? { x: caret.x + 14, y: caret.y + 6 } : caret
          return (
            <motion.span key={writer.id} className="modes-cursor" style={{ '--who': writer.color } as CSSProperties} initial={{ ...point, opacity: 0 }} animate={{ ...point, opacity: phase === 'idle' ? 0.5 : 1 }} transition={motionUnlessReduced(reducedMotion, cursorSpring)}>
              <svg viewBox="0 0 20 22" width="18" height="20">
                <path d="M2 1.5v16.2l4.6-4.3 3 6.6 2.9-1.3-3-6.5h6.3z" fill="var(--who)" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
              {mode === 'cloud' && phase !== 'idle' && <span className="modes-flag">{writer.name}</span>}
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Marks a cell with the writer in it: what they are doing there (unless they
 * have finished and only parked there), and their colour.
 */
function writerMarks(at: WriterAt | undefined) {
  if (!at) return {}
  return {
    'data-writer': at.phase === 'idle' ? undefined : at.phase,
    style: { '--who': at.writer.color } as CSSProperties,
  }
}

/** A cell as far as it has been typed, with a caret where its writer is. */
function Cell({ item, typed, at }: { item: SheetCell; typed: number; at: WriterAt | undefined }) {
  return (
    <>
      {item.text.slice(0, typed)}
      {at && <span className="modes-caret" data-caret={at.writer.id} data-phase={at.phase} />}
    </>
  )
}
