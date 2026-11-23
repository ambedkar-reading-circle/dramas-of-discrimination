import { useState } from 'react'

export function QuoteDeck() {
  const quotes = [
    { text: 'We came for a discussion. We stayed for the rehearsal.', source: 'Participant, OverTime debrief' },
    { text: 'Naming the Failure out loud changed what we tried next.', source: 'Member, PlayTime' },
    { text: 'The play let us fail safely — twice — before the street.', source: 'Facilitator, debrief notes' },
  ]
  const [shown, setShown] = useState(0)
  return (
    <div className="slide-quotes">
      {quotes.slice(0, shown).map((quote) => (
        <blockquote className="slide-quote rise-in" key={quote.text}>
          <p>“{quote.text}”</p>
          <cite>— {quote.source}</cite>
        </blockquote>
      ))}
      {shown < quotes.length && (
        <button className="slide-points-next" type="button" onClick={() => setShown((value) => value + 1)}>
          <span className="notebook-text">Reveal the next quote</span>
        </button>
      )}
    </div>
  )
}
