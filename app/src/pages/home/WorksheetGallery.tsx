import { worksheets } from './worksheets'
import type { Worksheet } from './worksheets'
import type { CSSProperties } from 'react'

function WorksheetCard({ worksheet }: { worksheet: Worksheet }) {
  return (
    <figure
      className="worksheet @container"
      style={
        {
          '--worksheet-width': worksheet.width,
          '--worksheet-height': worksheet.height,
        } as CSSProperties
      }
    >
      <a className="notebook-frame worksheet-preview relative [--notebook-frame-padding:var(--notebook-row)] [--notebook-frame-content-height:calc((100cqi_-_2*var(--notebook-frame-padding))*var(--worksheet-height)/var(--worksheet-width))] [--paper-color:var(--paper-backing)] [--paper-strength:var(--paper-backing-strength)] shadow-[inset_0_0_0_1px_transparent] hover:[--paper-color:var(--surface-warm)] hover:shadow-[inset_0_0_0_1px_var(--line)]" href={worksheet.imageUrl} aria-label={`View full-size ${worksheet.title} worksheet`}>
        <img className="w-full object-contain bg-(--primary-white) outline-1 outline-solid outline-(--sheet-edge) shadow-(--sheet-shadow)" src={worksheet.imageUrl} alt="" width={worksheet.width} height={worksheet.height} loading="lazy" />
        <span className="absolute right-2 bottom-[0.315em] text-[1.125rem]" aria-hidden="true">
          ↗
        </span>
      </a>
      <figcaption className="notebook-stack pt-row">
        <span className="eyebrow">{worksheet.label}</span>
        <h4 className="text-[1.125rem]">{worksheet.title}</h4>
        <p className="max-w-[52ch] text-ink-soft">{worksheet.description}</p>
      </figcaption>
    </figure>
  )
}

export default function WorksheetGallery() {
  return (
    <div className="mt-[calc(2*var(--notebook-row))] pt-row shadow-[inset_0_1px_var(--ink-faint)]">
      <div className="flex items-start justify-between gap-gutter mb-row max-md:grid max-md:gap-row">
        <h3>From the workshop table</h3>
        <p className="text-[0.9375rem] text-ink-soft">The sheets groups fill in during a workshop. Free to download, print, and reuse.</p>
      </div>
      <div className="grid grid-cols-2 gap-gutter items-start max-md:grid-cols-1 max-md:gap-row">
        {worksheets.map((worksheet) => (
          <WorksheetCard key={worksheet.id} worksheet={worksheet} />
        ))}
      </div>
    </div>
  )
}
