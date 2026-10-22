import { useContext } from 'react'
import DodLogo from '#/components/DodLogo'
import { manualPages, manual, manualBackCover } from '../content/manualContent'
import { ManualPageState, useManualPageActive } from '../context/ManualPageState'
import { AnnotatedParagraph } from './AnnotatedPhrase'
import { ManualAsciiCanvas } from './ManualAsciiCanvas'
import '../ManualFlipbook.css'

// The letter is re-typeset as short reading pages between the two covers.
export function ManualPage({ index }: { index: number }) {
  const active = useManualPageActive(index)
  const { canvasRoots } = useContext(ManualPageState)
  if (index === 0) {
    return (
      <div className="manual-page manual-title-page" aria-hidden="true">
        <img className="manual-illustration" src="/bg-image.svg" alt="" />
        <div className="manual-title-panel">
          <img className="manual-arc-logo rounded-sm overflow-clip" src="/ARCLogo-blue.png" alt="Ambedkar Reading Circle" />
          <div className="manual-subtitle">{manual.subtitle}</div>
          <DodLogo />
          <div className="manual-credits">
            {manual.origin}
            <br />
            {manual.credit}
          </div>
        </div>
      </div>
    )
  }
  if (index === manualBackCover) {
    return (
      <div className="manual-page manual-art-page" aria-hidden="true">
        <img className="manual-illustration" src="/bg-image.svg" alt="" />
      </div>
    )
  }
  const page = manualPages[index - 1]
  if (page.kind === 'canvas') {
    return (
      <div
        ref={(element) => {
          if (element) canvasRoots.add(element)
        }}
        className="manual-page manual-canvas-page manual-letter-inverse"
        data-canvas-page={index}
        data-page-id={page.id}
        inert={!active}
        aria-hidden={!active}
      >
        <div className="manual-letter-panel">
          <ManualAsciiCanvas number={index / 2} id={page.id} active={active} variant={page.variant} />
          <ManualFolio index={index} />
        </div>
      </div>
    )
  }
  return (
    <div className="manual-page manual-letter-page" data-letter-page={index} data-page-id={page.id} aria-hidden="true">
      <div className="manual-letter-panel">
        <div className="manual-reading-area">
          <div className="manual-letter-content">
            {page.salutation && <div className="manual-salutation">Dear Reader,</div>}
            <div className="manual-letter-copy">
              {page.blocks.map((block) => (
                <AnnotatedParagraph key={block.text} block={block} active={active} />
              ))}
            </div>
            {page.signature && (
              <div className="manual-signature">
                <div className="manual-salutation">Jai Bhim!</div>
                {manual.signature}
                <small>
                  {manual.email}
                  <br />
                  {manual.date}
                </small>
              </div>
            )}
          </div>
        </div>
        <ManualFolio index={index} />
      </div>
    </div>
  )
}

function ManualFolio({ index }: { index: number }) {
  return (
    <div className="manual-letter-folio" aria-hidden="true">
      <span>{index % 2 === 1 ? manual.title : 'Ambedkar Reading Circle'}</span>
      <span className="manual-page-number">
        {String(index).padStart(2, '0')} / {String(manualPages.length).padStart(2, '0')}
      </span>
    </div>
  )
}

export function ManualReading() {
  return (
    <div className="manual-reading notebook-stack">
      <h3>{manual.title}</h3>
      <p>{manual.subtitle}</p>
      <p>Ambedkar Reading Circle.</p>
      <p>
        {manual.origin} {manual.credit}.
      </p>
      <p>Dear Reader,</p>
      {manual.letter.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <p>Jai Bhim!</p>
      <p>
        {manual.signature}
        <br />
        {manual.email}
        <br />
        {manual.date}
      </p>
    </div>
  )
}
