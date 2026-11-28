import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'

const PENCIL_STORAGE_KEY = 'pencil'

export type PencilPreference = {
  enabled: boolean
  toggleEnabled: () => void
}

const PencilPreferenceContext = createContext<PencilPreference | null>(null)

function getInitialEnabled() {
  if (typeof window === 'undefined') return true
  try {
    return window.localStorage.getItem(PENCIL_STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

export function usePencilPreferenceState(): PencilPreference {
  const [enabled, setEnabled] = useState(getInitialEnabled)

  useEffect(() => {
    try {
      window.localStorage.setItem(PENCIL_STORAGE_KEY, enabled ? 'on' : 'off')
    } catch {
    }
  }, [enabled])

  function toggleEnabled() {
    setEnabled((current) => !current)
  }

  return { enabled, toggleEnabled }
}

export function PencilPreferenceProvider({
  value,
  children,
}: {
  value: PencilPreference
  children: ReactNode
}) {
  return createElement(PencilPreferenceContext.Provider, { value }, children)
}

export function usePencilPreference() {
  const preference = useContext(PencilPreferenceContext)
  if (!preference) {
    throw new Error(
      'usePencilPreference must be used within PencilTraceProvider',
    )
  }
  return preference
}
