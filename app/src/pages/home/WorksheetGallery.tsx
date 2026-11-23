import WorksheetCard from '#/components/WorksheetCard'
import { worksheets } from './content/worksheets'

export default function WorksheetGallery() {
  return (
    <div className="mt-[calc(2*var(--notebook-row))] pt-row shadow-[inset_0_1px_var(--ink-faint)]">
      <div className="flex items-start justify-between gap-gutter mb-row max-md:grid max-md:gap-row">
        <h3>From the workshop table</h3>
        <p className="text-[0.9375rem] text-ink-soft">The sheets groups fill in during a workshop. Free to download, print, and reuse.</p>
      </div>
      <div className="grid grid-cols-2 gap-gutter items-start max-md:grid-cols-1 max-md:gap-row">
        {worksheets.map((worksheet) => (
          <WorksheetCard
            key={worksheet.id}
            imageUrl={worksheet.imageUrl}
            width={worksheet.width}
            height={worksheet.height}
            label={worksheet.label}
            title={worksheet.title}
            description={worksheet.description}
            linkLabel={`View full-size ${worksheet.title} worksheet`}
          />
        ))}
      </div>
    </div>
  )
}