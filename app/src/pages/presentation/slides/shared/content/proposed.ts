/** The label on everything the deck shows that is proposed, not yet built: slides 06–09 and the guide's own frame. */
export const proposedLabel = 'Proposed, in development'

/** A proposed slide's kicker, lettered in the order the deck shows the proposals. */
export const proposedKicker = (letter: string) => `${proposedLabel} · ${letter}`
