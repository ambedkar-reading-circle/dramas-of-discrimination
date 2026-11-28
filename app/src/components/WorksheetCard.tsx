import type { CSSProperties } from 'react'

type WorksheetCardProps = {
  imageUrl: string
  width: number
  height: number
  label: string
  title: string
  description: string
  linkLabel: string
  heading?: 'h3' | 'h4'
}

export default function WorksheetCard({ imageUrl, width, height, label, title, description, linkLabel, heading: Heading = 'h4' }: WorksheetCardProps) {
  return (
    <figure
      className="worksheet @container"
      style={
        {
          '--worksheet-width': width,
          '--worksheet-height': height,
        } as CSSProperties
      }
    >
      <a className="notebook-frame worksheet-preview relative [--notebook-frame-padding:var(--notebook-row)] [--notebook-frame-content-height:calc((100cqi_-_2*var(--notebook-frame-padding))*var(--worksheet-height)/var(--worksheet-width))] [--paper-color:var(--paper-backing)] [--paper-strength:var(--paper-backing-strength)] shadow-[inset_0_0_0_1px_transparent] hover:[--paper-color:var(--surface-warm)] hover:shadow-[inset_0_0_0_1px_var(--line)]" href={imageUrl} aria-label={linkLabel}>
        <img className="w-full object-contain bg-(--primary-white) outline-1 outline-solid outline-(--sheet-edge) shadow-(--sheet-shadow)" src={imageUrl} alt="" width={width} height={height} loading="lazy" />
        <span className="absolute right-2 bottom-[0.315em] text-[1.125rem]" aria-hidden="true">
          ↗
        </span>
      </a>
      <figcaption className="notebook-stack pt-row">
        <span className="eyebrow">{label}</span>
        <Heading className={Heading === 'h4' ? 'text-[1.125rem]' : undefined}>{title}</Heading>
        <p className="max-w-[52ch] text-ink-soft">{description}</p>
      </figcaption>
    </figure>
  )
}
