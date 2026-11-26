const surfaceAttribute = 'data-reveal-surface'
const triggerAttribute = 'data-reveal-trigger'
const keepAttribute = 'data-reveal-keep'

export const revealSurface = { [surfaceAttribute]: '' }
export const revealTrigger = { [triggerAttribute]: '' }
/** Controls that leave an open reveal alone, such as a player that decides for itself what the page shows next. */
export const revealKeep = { [keepAttribute]: '' }
export const insideReveal = `[${surfaceAttribute}], [${triggerAttribute}], [${keepAttribute}]`
