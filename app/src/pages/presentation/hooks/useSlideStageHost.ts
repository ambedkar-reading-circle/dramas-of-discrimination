import { createContext, use } from 'react'

export const SlideStageHostContext = createContext<HTMLElement | null>(null)

export function useSlideStageHost(): HTMLElement | null {
  return use(SlideStageHostContext)
}
