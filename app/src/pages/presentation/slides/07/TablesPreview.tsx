import WorksheetCard from '#/components/WorksheetCard'
import { worksheets } from '#/pages/home/content'

const tableCopy: Partial<Record<string, { label: string; title: string; description: string }>> = {
  'actors-activities-challenges': {
    label: 'Table one',
    title: 'Actor map',
    description: 'One row per Actor: its name, its Ideal behaviour, and its Failures.',
  },
  storytime: {
    label: 'Table two',
    title: 'Play script',
    description: 'The Scenario as directed Dialogues between speakers, each tagged to the Failures it shows.',
  },
}

export function TablesPreview() {
  return (
    <div className="presentation-tables">
      {worksheets.map((worksheet) => {
        const copy = tableCopy[worksheet.id]
        if (!copy) return null
        return <WorksheetCard key={worksheet.id} imageUrl={worksheet.imageUrl} width={worksheet.width} height={worksheet.height} label={copy.label} title={copy.title} description={copy.description} linkLabel={`View the full ${copy.title} sheet`} heading="h3" />
      })}
    </div>
  )
}
