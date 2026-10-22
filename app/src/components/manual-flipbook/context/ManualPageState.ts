import { createContext, useContext } from 'react'

export const ManualPageState = createContext({
  page: 0,
  desktop: false,
  busy: false,
  inStage: false,
  canvasRoots: new WeakSet<HTMLElement>(),
})

export function useManualPageActive(index: number) {
  const { page, desktop, busy, inStage } = useContext(ManualPageState)
  return (
    inStage &&
    !busy &&
    (index === page || (desktop && page > 0 && index === page + 1))
  )
}
