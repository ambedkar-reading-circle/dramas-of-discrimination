import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { workshopActivities } from './workshopActivities'
import './WorkshopMethod.css'
import NotebookSurface from '#/components/NotebookSurface'

const rotations = [-13, -6, 2, 9, 15]
const offsets = [65, 22, 0, 30, 78]
const spring = { type: 'spring' as const, stiffness: 220, damping: 28 }

/** Printed diagrams share the ink and paper of the activity sheet. */
function ActivityDrawing({ index }: { index: number }) {
  return (
    <svg className="method-drawing" viewBox="0 0 240 130" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {index === 0 && (
        <>
          <path d="M28 23h115v53H72L48 94V76H28Z" />
          <path d="M105 48h105v50h-26l-2 18-23-18h-54" />
          <path d="M45 41h69M45 51h83M45 61h48M161 67h30M156 78h35" />
          <circle cx="128" cy="100" r="5" />
          <path d="M117 117c0-15 22-15 22 0" />
        </>
      )}
      {index === 1 && (
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
      )}
      {index === 2 && (
        <>
          <path d="m48 27 133-13 8 100-133 9Z" />
          <path d="M62 17h130v97H62Z" fill="var(--activity-paper)" />
          <path d="M77 35h33M77 49h98M77 58h81M77 78h24M77 91h98M77 100h65" />
          <path d="m181 99 25-46 8 5-25 46-10 9Z" fill="var(--activity-paper)" />
          <path d="m204 57 8 5" />
        </>
      )}
      {index === 3 && (
        <>
          <path d="M30 17h180v99H30ZM30 29h180M48 29v72m144-72v72M21 116h198" />
          <path d="m106 44 38 22-38 22Z" />
          <path d="M69 87a16 16 0 1 0 7 13m-7-13 1 11-11-2" />
          <path d="M48 29c-2 22-6 33-18 40m162-40c2 22 6 33 18 40" />
        </>
      )}
      {index === 4 && (
        <>
          <path d="M68 32c-29 36-5 80 39 80 46 0 66-55 32-83-15-12-36-14-52-4M68 32l2-19m-2 19 20 1" />
          <path d="m91 65 15 15 28-32" />
          <path d="M162 42h49M172 57h39M169 72h42M161 87h50" strokeDasharray="2 4" />
        </>
      )}
    </svg>
  )
}

export default function WorkshopMethod() {
  const [active, setActive] = useState<number | null>(null)
  const [width, setWidth] = useState(900)
  const [sheetHeight, setSheetHeight] = useState(620)
  const surface = useRef<HTMLElement>(null)
  const deck = useRef<HTMLDivElement>(null)
  const triggers = useRef<Array<HTMLButtonElement | null>>([])
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    const element = surface.current
    if (!element) return

    // Align controls as complete boxes so their labels retain even padding.
    // Relative offsets preserve document flow and the existing paper rules.
    const alignText = () => {
      const origin = element.getBoundingClientRect().top
      const row = parseFloat(getComputedStyle(element).lineHeight)
      for (const text of element.querySelectorAll<HTMLElement>('.section-lede .eyebrow, .method-index-button .notebook-text, .method-deck-hint')) {
        const target = text.closest<HTMLElement>('.method-index-button') ?? text
        const marker = document.createElement('span')
        marker.setAttribute('aria-hidden', 'true')
        marker.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;border:0;vertical-align:baseline'
        text.prepend(marker)
        const previousOffset = parseFloat(getComputedStyle(target).top) || 0
        const baseline = marker.getBoundingClientRect().top - origin - previousOffset
        marker.remove()
        const rule = Math.round((baseline - row / 2) / row) * row + row / 2
        target.style.setProperty('--method-baseline-offset', `${rule - baseline}px`)
      }
    }

    alignText()
    const observer = new ResizeObserver(alignText)
    observer.observe(element)
    // The section can keep its viewport minimum while the deck changes size.
    if (deck.current) observer.observe(deck.current)
    for (const control of element.querySelectorAll('.method-index, .method-deck-hint')) observer.observe(control)
    document.fonts.addEventListener('loadingdone', alignText)
    return () => {
      observer.disconnect()
      document.fonts.removeEventListener('loadingdone', alignText)
    }
  }, [])

  useEffect(() => {
    const element = deck.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const element = deck.current?.querySelector<HTMLLIElement>('.method-sheet--open')
    if (!element) return
    const observer = new ResizeObserver(() => setSheetHeight(element.offsetHeight))
    observer.observe(element)
    return () => observer.disconnect()
  }, [active])

  const small = width < 600
  const cardWidth = small ? Math.min(230, width - 40) : 260
  const spread = Math.min(142, Math.max(20, (width - cardWidth - 60) / 4))
  const transition = reduceMotion ? { duration: 0 } : spring
  const select = (index: number) => {
    setActive((current) => (current === index ? null : index))
    // Keep the new sheet visible when switching from the lower index.
    requestAnimationFrame(() => deck.current?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'instant' : 'smooth' }))
  }

  return (
    <NotebookSurface
      as="section"
      ref={surface}
      tone="inverse"
      id="workshop-method"
      className="notebook-section workshop-method-surface"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && active !== null) {
          triggers.current[active]?.focus()
          setActive(null)
        }
      }}
    >
      <div className="page-wrap workshop-method">
        <div className="section-lede">
          <p className="eyebrow">The workshop, in five acts</p>
        </div>
        <div className="method-collection" data-notebook-independent>
          <div className="method-deck" ref={deck} style={{ height: active === null ? (small ? 475 : 550) : sheetHeight + 165 }}>
            <ol className="method-sheets" aria-label="Workshop activities">
              {workshopActivities.map((activity, index) => {
                const selected = active === index
                const gathered = active !== null && !selected
                const dockIndex = active === null ? index : index > active ? index - 1 : index
                const sheetWidth = selected ? Math.min(760, width - 12) : cardWidth
                return (
                  <motion.li key={activity.name} className={`method-sheet ${selected ? 'method-sheet--open' : ''} ${gathered ? 'method-sheet--gathered' : ''}`} layout={!reduceMotion} initial={false} animate={{ x: selected ? 0 : gathered ? (dockIndex - 1.5) * (small ? 55 : 72) : (index - 2) * spread, y: selected ? 0 : gathered ? sheetHeight + 30 : offsets[index], rotate: selected ? 0 : gathered ? (dockIndex - 1.5) * 5 : rotations[index], scale: gathered ? 0.26 : selected || !small ? 1 : 0.8 }} transition={transition} whileHover={!small && !selected && !gathered && !reduceMotion ? { y: offsets[index] - 25, rotate: 0 } : undefined} style={{ width: sheetWidth, marginLeft: -sheetWidth / 2, zIndex: selected ? 20 : index + 1, originX: 0.5, originY: 0 }}>
                    <div className="method-sheet-topline">
                      <span>
                        workshop
                        <br />
                        activity
                      </span>
                      <span>{String(index + 1).padStart(2, '0')} / 05</span>
                    </div>
                    <h3>{activity.name}</h3>
                    <p className="method-sheet-subtitle">{activity.title}</p>
                    <div className="method-sheet-timing">
                      <span className="method-clock" aria-hidden="true" />
                      {activity.duration} minutes
                    </div>
                    {!selected && (
                      <div className="method-sheet-preview">
                        <ActivityDrawing index={index} />
                        <p>{activity.preview}</p>
                      </div>
                    )}
                    {selected && (
                      <motion.div id={`activity-${index}-content`} className="method-sheet-content" role="region" aria-label={`${activity.name} activity details`} tabIndex={0} data-lenis-prevent initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.25, delay: reduceMotion ? 0 : 0.12 }}>
                        <p className="method-sheet-summary">{activity.summary}</p>
                        <div className="method-sheet-columns">
                          <div>
                            <h4>IN THE ROOM</h4>
                            <ol className="method-instructions">
                              {activity.steps.map((step, n) => (
                                <li key={step}>
                                  <span aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                                  <p>{step}</p>
                                </li>
                              ))}
                            </ol>
                          </div>
                          <aside className="method-facilitator">
                            <h4>A PROMPT TO BEGIN</h4>
                            <span className="method-quote" aria-hidden="true">
                              “
                            </span>
                            <p>{activity.prompt}</p>
                            <ActivityDrawing index={index} />
                          </aside>
                        </div>
                        <div className="method-sheet-takeaway">
                          <span>TAKE FORWARD</span>
                          <p>{activity.takeaway}</p>
                        </div>
                      </motion.div>
                    )}
                    <div className="method-sheet-footer" aria-hidden="true">
                      <span>DRAMAS OF DISCRIMINATION</span>
                      <span>{selected ? 'ARC / FACILITATION NOTES' : 'OPEN SHEET ↗'}</span>
                    </div>
                    <button
                      ref={(element) => {
                        triggers.current[index] = element
                      }}
                      type="button"
                      className="method-sheet-trigger"
                      aria-label={`${selected ? 'Close' : 'Open'} ${activity.name}: ${activity.title}`}
                      aria-expanded={selected}
                      aria-controls={selected ? `activity-${index}-content` : undefined}
                      onClick={() => select(index)}
                    >
                      {selected ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                          <path d="m5 5 14 14M19 5 5 19" />
                        </svg>
                      ) : (
                        <span aria-hidden="true">+</span>
                      )}
                    </button>
                  </motion.li>
                )
              })}
            </ol>
          </div>
          <nav className="method-index" aria-label="Choose a workshop activity">
            {workshopActivities.map((activity, index) => (
              <button className="method-index-button" key={activity.name} type="button" aria-pressed={active === index} onClick={() => select(index)}>
                <span className="notebook-text">
                  <span className="method-index-number">{String(index + 1).padStart(2, '0')}</span>
                  {activity.name}
                </span>
              </button>
            ))}
          </nav>
          <p className="method-deck-hint">{active === null ? 'Select any activity to open its facilitation sheet.' : 'Choose another sheet below, or press Esc to return to the collection.'}</p>
        </div>
      </div>
    </NotebookSurface>
  )
}
