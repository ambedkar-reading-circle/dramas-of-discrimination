import { createContext, use } from 'react'

/**
 * The slide stage element, provided by SlideStage. Slide bodies portal
 * overlays into it so they cover the whole stage, outside the slide's
 * scale-to-fit transform.
 */
export const SlideStageHostContext = createContext<HTMLElement | null>(null)

export function useSlideStageHost(): HTMLElement | null {
  return use(SlideStageHostContext)
}
