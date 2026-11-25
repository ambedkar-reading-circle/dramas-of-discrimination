import { useId, useState } from 'react'
import { motion } from 'motion/react'
import { GuideFrame } from '../shared/GuideFrame'
import { collection, kindLabels, manifestos, sharedPledges } from './content/portal'
import type { CommunityKind, PledgeId, PortalManifesto } from './content/portal'
import '../shared/modes.css'
import './PortalMockup.css'

type View = 'explore' | 'common'

const views: ReadonlyArray<{ value: View; label: string }> = [
  { value: 'explore', label: 'Explore' },
  { value: 'common', label: 'Common ground' },
]

const count = new Intl.NumberFormat('en-IN')

/**
 * Mockup: the Manifesto portal. Communities explore and share the Manifestos
 * of Inclusion they adopted; read together, the collection shows the pledges
 * they hold in common.
 */
export function PortalMockup() {
  const [view, setView] = useState<View>('explore')
  const tabsId = useId()

  return (
    <GuideFrame
      label="Mockup: the Manifesto portal, where Communities read and share their Manifestos of Inclusion and see the pledges they hold in common"
      className="modes portal"
      title={
        <>
          <span aria-hidden="true">❦</span> Manifesto portal
        </>
      }
      bar={
        <span className="modes-chip" data-mode="cloud">
          <span className="modes-chip-dot" aria-hidden="true" />
          {count.format(collection.manifestos)} Manifestos · {collection.cities} cities
        </span>
      }
    >
      <article className="fac-sheet modes-sheet">
        <div className="modes-tabs" role="tablist" aria-label="Portal">
          {views.map((item) => (
            <button key={item.value} type="button" role="tab" id={`${tabsId}-${item.value}`} aria-selected={view === item.value} aria-controls={`${tabsId}-panel`} className="modes-tab" data-active={view === item.value ? '' : undefined} onClick={() => setView(item.value)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="portal-panel" role="tabpanel" id={`${tabsId}-panel`} aria-labelledby={`${tabsId}-${view}`}>
          {view === 'explore' ? <Explore /> : <CommonGround />}
        </div>
      </article>
    </GuideFrame>
  )
}

const kinds = Object.keys(kindLabels) as Array<CommunityKind>

/** Whether a Manifesto is of the chosen kind and holds the search word anywhere in its text. */
function matches(item: PortalManifesto, kind: CommunityKind | 'all', needle: string) {
  if (kind !== 'all' && item.kind !== kind) return false
  if (!needle) return true
  return [item.community, item.place, item.opening, ...item.values, ...item.pledges].join(' ').toLowerCase().includes(needle)
}

/** Every shared Manifesto, by the Community that adopted it; one open to read whole. */
function Explore() {
  const [kind, setKind] = useState<CommunityKind | 'all'>('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(manifestos[0].id)

  const needle = query.trim().toLowerCase()
  const shown = manifestos.filter((item) => matches(item, kind, needle))
  const open = manifestos.find((item) => item.id === openId) ?? manifestos[0]

  return (
    <div className="portal-explore">
      <div className="portal-tools">
        <label className="portal-search">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span className="sr-only">Search Manifestos</span>
          <input type="search" value={query} placeholder="Search a word: water, rent, credit…" onChange={(event) => setQuery(event.target.value)} />
        </label>
        <span className="portal-chips" role="group" aria-label="Kind of Community">
          {(['all', ...kinds] as const).map((item) => (
            <button key={item} type="button" className="portal-chip" aria-pressed={kind === item} onClick={() => setKind(item)}>
              {item === 'all' ? 'All' : kindLabels[item]}
            </button>
          ))}
        </span>
      </div>

      <div className="portal-browse">
        <div className="portal-list">
          <p className="fac-label" aria-live="polite">
            {shown.length === 0 ? 'No Manifesto matches' : `Showing ${shown.length} of ${count.format(collection.manifestos)}`}
          </p>
          <ul className="portal-cards">
            {shown.map((item) => (
              <li key={item.id}>
                <button type="button" className="portal-card" aria-pressed={item.id === open.id} onClick={() => setOpenId(item.id)}>
                  <span className="portal-card-kind">{kindLabels[item.kind]}</span>
                  <span className="portal-card-name">{item.community}</span>
                  <span className="portal-card-meta">
                    {item.place} · {item.people} people
                  </span>
                  <span className="portal-card-line">{item.opening}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <Reader manifesto={open} />
      </div>
    </div>
  )
}

/** One Manifesto, whole, as its Community adopted it. */
function Reader({ manifesto }: { manifesto: PortalManifesto }) {
  return (
    <section className="portal-reader" aria-label={`Manifesto of Inclusion: ${manifesto.community}, ${manifesto.place}`}>
      <motion.div key={manifesto.id} className="portal-reader-page" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <h3 className="portal-reader-title">Manifesto of Inclusion</h3>
        <p className="portal-reader-by">
          {manifesto.community}, {manifesto.place}
        </p>
        <p className="portal-reader-opening">{manifesto.opening}</p>
        <ul className="portal-reader-values">
          {manifesto.values.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
        <p className="portal-reader-heading">And to these ends we pledge</p>
        <ul className="portal-reader-pledges">
          {manifesto.pledges.map((pledge) => (
            <li key={pledge}>{pledge}</li>
          ))}
        </ul>
        <p className="portal-reader-adopted">
          Adopted {manifesto.adopted} by {manifesto.people} people
        </p>
      </motion.div>
    </section>
  )
}

/** The pledges the whole collection holds in common. */
function CommonGround() {
  const ranked = [...(Object.keys(sharedPledges) as Array<PledgeId>)].sort((a, b) => collection.shares[b] - collection.shares[a])

  const tiles = [
    { label: 'Manifestos', value: count.format(collection.manifestos) },
    { label: 'People', value: count.format(collection.people) },
    { label: 'Cities', value: count.format(collection.cities) },
    { label: 'Kinds of Community', value: kinds.length },
  ]

  return (
    <div className="portal-common">
      <dl className="portal-tiles">
        {tiles.map((tile) => (
          <div key={tile.label} className="portal-tile">
            <dt className="fac-label">{tile.label}</dt>
            <dd>{tile.value}</dd>
          </div>
        ))}
      </dl>

      <section className="portal-pledges" aria-label="What Communities pledge">
        <div>
          <h3 className="portal-h">What Communities pledge</h3>
          <p className="portal-sub">Share of Manifestos making each pledge, in their own words</p>
        </div>
        <ol className="portal-bars">
          {ranked.map((id, index) => (
            <li key={id} title={`${sharedPledges[id]}: ${count.format(Math.round(collection.shares[id] * collection.manifestos))} of ${count.format(collection.manifestos)} Manifestos`}>
              <span className="portal-bar-label">{sharedPledges[id]}</span>
              <span className="portal-bar-value">{Math.round(collection.shares[id] * 100)}%</span>
              <span className="portal-bar-track">
                <motion.span className="portal-bar-fill" initial={{ width: 0 }} animate={{ width: `${collection.shares[id] * 100}%` }} transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
