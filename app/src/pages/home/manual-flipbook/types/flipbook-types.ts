import type {} from 'react-pageflip/build/html-flip-book/settings'

export interface TurnProgressEvent {
  data: { progress: number; direction: number }
}

/** What the scroll policy needs from a book. The page-flip library stays behind
 *  the adapter that implements this. */
export interface BookDriver {
  canTurn: () => boolean
  turnTo: (page: number) => void
  jumpTo: (page: number) => void
}

declare module 'react-pageflip/build/html-flip-book/settings' {
  interface IEventProps {
    /** Added by scripts/patch-flipbook.mjs, from actual fold geometry. */
    onTurnProgress?: (event: TurnProgressEvent) => void
  }
}
