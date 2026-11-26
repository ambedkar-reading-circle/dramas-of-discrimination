import { useRef, useState } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import { usePrefersReducedMotion } from '#/lib/use-media-query'
import { workshopActivities } from '#/pages/home/workshop-method'
import { members } from '../shared/content/actorMap'
import { GuideFrame } from '../shared/GuideFrame'
import { ModeBar, useModeCue } from '../shared/ModeControls'
import type { Mode } from '../shared/ModeControls'
import { SheetTabs } from '../shared/SheetTabs'
import { useCopyText } from '../shared/useCopyText'
import { WriterCaret, WriterCursors } from '../shared/WriterCursors'
import { FernCorner } from './FernCorner'
import { draft, prompt } from './content/manifesto'
import type { DraftBlock } from './content/manifesto'
import { useManifestoDraft } from './hooks/useManifestoDraft'
import type { Segment } from './hooks/useManifestoDraft'
import { verbOf } from '../../playback/cues'
import { useSlideCue } from '../../playback/useSlideCue'
import './ManifestoMockup.css'

/** The journey's position past its last act: the workshop is done, and the Manifesto comes next. */
const afterLastAct = workshopActivities.length

const tabs: Record<Mode, ReadonlyArray<string>> = {
  local: ['Worksheets', 'Prompt export'],
  cloud: ['Worksheets', 'Manifesto', 'Portal'],
}

/**
 * Mockup: the facilitation guide once the workshop is done, in either mode.
 * Local mode hands the room a prompt to carry to its own LLM; Cloud mode
 * generates the Manifesto of Inclusion and every Member edits it at once.
 */
export function ManifestoMockup() {
  const [mode, setMode] = useState<Mode>('local')
  // Generating and editing happen in Cloud mode.
  useModeCue(setMode, ({ verb }) => (verb === 'generate' || verb === 'edit' ? 'cloud' : null))

  return (
    <GuideFrame label="Mockup: in Local mode the Group's worksheets become a prompt to copy into any LLM; in Cloud mode the platform generates the Manifesto of Inclusion and several Members edit it at once" className="modes mani" mode={mode} act={afterLastAct} step={0} bar={<ModeBar mode={mode} onChange={setMode} />}>
      <article className="fac-sheet modes-sheet" aria-label={mode === 'local' ? 'Prompt export' : 'Manifesto of Inclusion'}>
        {mode === 'local' ? <PromptExport /> : <ManifestoDraft />}
      </article>
    </GuideFrame>
  )
}

/** Local mode: the Group's worksheets as a prompt, ready to copy. */
function PromptExport() {
  const { copied, copy } = useCopyText(prompt)

  return (
    <>
      <SheetTabs tabs={tabs.local} active={1} />
      <div className="mani-body">
        <div className="mani-head">
          <div>
            <p className="fac-label">Prompt export</p>
            <p className="mani-lede">Paste this into an LLM of your choosing. The platform never sees it.</p>
          </div>
          <button type="button" className="mani-btn" data-done={copied ? '' : undefined} onClick={copy}>
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              {copied ? <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M9 9h10v11H9zM5 15V4h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />}
            </svg>
            <span aria-live="polite">{copied ? 'Copied' : 'Copy prompt'}</span>
          </button>
        </div>
        <pre className="mani-prompt" tabIndex={0} aria-label="Prompt">
          {prompt}
        </pre>
      </div>
    </>
  )
}

const sparkle = 'M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z'

const pencil = 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4'

const generateLabel = {
  idle: 'Generate Manifesto of Inclusion',
  generate: 'Generating…',
} as const

/** Cloud mode: the Facilitator generates the draft, then the Group's Members rework it together. */
function ManifestoDraft() {
  const reducedMotion = usePrefersReducedMotion()
  const { stage, playing, segmentsOf, editors, generate, edit } = useManifestoDraft(reducedMotion)
  // The Facilitator's two presses, played on their points.
  useSlideCue((cue) => {
    const verb = verbOf(cue)
    if (verb === 'generate') generate()
    else if (verb === 'edit') edit()
  })
  const charter = useRef<HTMLDivElement>(null)
  const drafted = stage !== 'idle' && stage !== 'generate'

  return (
    <>
      <SheetTabs tabs={tabs.cloud} active={1}>
        <button type="button" className="mani-btn" data-quiet={drafted ? '' : undefined} disabled={playing} aria-busy={stage === 'generate'} onClick={generate}>
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path d={sparkle} fill="currentColor" />
          </svg>
          <span>{stage === 'idle' || stage === 'generate' ? generateLabel[stage] : 'Generate again'}</span>
        </button>
        <button type="button" className="mani-btn" data-quiet={stage === 'generated' ? undefined : ''} disabled={!drafted || playing} aria-busy={stage === 'edit'} onClick={edit}>
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path d={pencil} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <span>{stage === 'edit' ? `${members.length} Members editing…` : stage === 'done' ? 'Edit again' : 'Edit together'}</span>
        </button>
      </SheetTabs>

      <Charter ref={charter} blank={stage === 'idle'} overlay={<WriterCursors container={charter} writers={editors} named />}>
        {draft.map((block) => (
          <DraftLine key={block.id} block={block}>
            <Segments segments={segmentsOf(block.id)} />
          </DraftLine>
        ))}
      </Charter>
    </>
  )
}

/** The Manifesto as an illuminated charter: fern fronds at the corners, a blackletter title. */
function Charter({ ref, blank, overlay, children }: { ref: RefObject<HTMLDivElement | null>; blank: boolean; overlay: ReactNode; children: ReactNode }) {
  return (
    <div ref={ref} className="mani-charter" data-blank={blank ? '' : undefined}>
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
        <FernCorner key={corner} className={`mani-fern mani-fern--${corner}`} />
      ))}
      <span className="mani-fleuron mani-fleuron--top" aria-hidden="true">
        ❦
      </span>
      <span className="mani-fleuron mani-fleuron--bottom" aria-hidden="true">
        ❦
      </span>
      <div className="mani-page">
        <h3 className="mani-title">Manifesto of Inclusion</h3>
        {blank ? <p className="mani-empty">The Facilitator generates the draft once every Group has submitted its worksheets.</p> : children}
      </div>
      {overlay}
    </div>
  )
}

function DraftLine({ block, children }: { block: DraftBlock; children: ReactNode }) {
  switch (block.kind) {
    case 'heading':
      return <h4 className="mani-heading">{children}</h4>
    case 'value':
    case 'pledge':
      return <p className={`mani-item mani-item--${block.kind}`}>{children}</p>
    default:
      return <p className={`mani-${block.kind}`}>{children}</p>
  }
}

function Segments({ segments }: { segments: ReadonlyArray<Segment> }) {
  return segments.map((segment, index) => {
    switch (segment.kind) {
      case 'text':
        return segment.text
      case 'stream':
        return <span key={index} className="mani-stream" aria-hidden="true" />
      case 'caret':
        return <WriterCaret key={index} at={segment} />
      default:
        return (
          <span key={index} className={`mani-${segment.kind}`} style={{ '--who': segment.writer.color } as CSSProperties} title={segment.kind === 'mark' ? `Edited by ${segment.writer.name}` : undefined}>
            {segment.text}
          </span>
        )
    }
  })
}
