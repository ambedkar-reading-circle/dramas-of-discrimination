import { createContext, use } from 'react'

export const SlideDirectionContext = createContext<1 | -1>(1)

export function useSlideDirection(): 1 | -1 {
  return use(SlideDirectionContext)
}
