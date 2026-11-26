import { createContext, use } from 'react'

/**
 * The layer over the slide stage, provided by SlideStage. Slide bodies portal
 * overlays into it so they cover the stage's visible area, outside the slide's
 * scale-to-fit transform and outside the stage's scroll.
 */
export const SlideStageHostContext = createContext<HTMLElement | null>(null)

export function useSlideStageHost(): HTMLElement | null {
  return use(SlideStageHostContext)
}
