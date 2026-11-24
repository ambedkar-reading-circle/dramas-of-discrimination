import { createContext, use } from 'react'
import type { PhotoReveal } from '#/components/InstantPhoto'
import type { ApproachSide } from '../types'

/** The photo reveal shared by the slide's photo layer and every approach cell. */
export const ApproachRevealContext =
  createContext<PhotoReveal<ApproachSide> | null>(null)

export function useApproachReveal(): PhotoReveal<ApproachSide> {
  const reveal = use(ApproachRevealContext)
  if (!reveal)
    throw new Error(
      'useApproachReveal must be used inside ApproachRevealContext',
    )
  return reveal
}
