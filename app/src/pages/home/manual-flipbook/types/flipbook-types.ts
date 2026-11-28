import type {} from 'react-pageflip/build/html-flip-book/settings'

export interface TurnProgressEvent {
  data: { progress: number; direction: number }
}

export interface BookDriver {
  canTurn: () => boolean
  turnTo: (page: number) => void
  jumpTo: (page: number) => void
}

declare module 'react-pageflip/build/html-flip-book/settings' {
  interface IEventProps {
    onTurnProgress?: (event: TurnProgressEvent) => void
  }
}
