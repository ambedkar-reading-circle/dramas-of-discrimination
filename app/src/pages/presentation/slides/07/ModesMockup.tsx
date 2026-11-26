import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'motion/react'
import { twoDigit } from '#/lib/format'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { workshopActivities } from '#/pages/home/workshop-method'
import { actorRows, categories, members, scenarioCell, scribe } from '../shared/content/actorMap'
import type { SheetCell, Writer } from '../shared/content/actorMap'
import { GuideFrame } from '../shared/GuideFrame'
import { ModeBar } from '../shared/ModeControls'
import { useCueTarget } from '../../playback/targets'
import type { Mode } from '../shared/ModeControls'
import { SheetTabs } from '../shared/SheetTabs'
import { WriterCaret, WriterCursors } from '../shared/WriterCursors'
import { useSheetFill } from './hooks/useSheetFill'
import type { WriterAt } from './hooks/useSheetFill'
import './ModesMockup.css'

/** PartTime, on its last step: the Group fills in the Actor map. */
const act = 1
const step = workshopActivities[act].steps.length - 1

const writersFor: Record<Mode, ReadonlyArray<Writer>> = { local: [scribe], cloud: members }

const sheetTabs = ['Steps', 'Example', 'Actor map']

/**
 * Mockup: the facilitation guide open on PartTime's Actor map, in either mode.
 * In Local mode one cursor fills the sheet on the room's shared screen; in
 * Cloud mode every Member's cursor writes into it at once, each under their
 * own name.
 */
export function ModesMockup() {
  const [mode, setMode] = useState<Mode>('local')
  useCueTarget('mode', setMode, { value: mode })

  return (
    <GuideFrame label="Mockup: in Local mode the Actor map is filled on one device and its data stays there; in Cloud mode the data is shared with the platform and several Members fill it at once" className="modes actor-fill" mode={mode} act={act} step={step} bar={<ModeBar mode={mode} onChange={setMode} />}>
      <article className="fac-sheet modes-sheet" aria-label="Actor map">
        {/* The journey above already names the act, so the sheet carries only its tabs. */}
        <SheetTabs tabs={sheetTabs} active={2} />
        <ActorMapSheet key={mode} mode={mode} />
      </article>
    </GuideFrame>
  )
}

/** The Actor map with its writers' cursors laid over it, typing it in. */
function ActorMapSheet({ mode }: { mode: Mode }) {
  const reducedMotion = usePrefersReducedMotion()
  const { typedOf, writers } = useSheetFill(writersFor[mode], reducedMotion)
  const wrap = useRef<HTMLDivElement>(null)
  const writerOn = new Map(writers.map((at) => [at.cell, at]))

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

      <WriterCursors container={wrap} writers={writers} named={mode === 'cloud'} />
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
      {at && <WriterCaret at={at} />}
    </>
  )
}
