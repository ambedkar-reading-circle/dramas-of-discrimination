import { createContext, use } from 'react'

/**
 * Which way the deck last travelled: 1 forward, -1 back. Provided by
 * SlideStage, so a slide's own entrance and exit can follow the reader.
 */
export const SlideDirectionContext = createContext<1 | -1>(1)

export function useSlideDirection(): 1 | -1 {
  return use(SlideDirectionContext)
}
