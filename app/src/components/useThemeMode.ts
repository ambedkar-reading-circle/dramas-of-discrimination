import { useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme'

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }

  // Resolve first visits and previously saved Auto preferences once.
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyThemeMode(mode: ThemeMode) {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(mode)
  document.documentElement.setAttribute('data-theme', mode)
  document.documentElement.style.colorScheme = mode
}

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode)

  useEffect(() => {
    applyThemeMode(mode)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch {
      // Keep the selected theme for this visit even without persistent storage.
    }
  }, [mode])

  function toggleMode() {
    setMode((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return { mode, toggleMode }
}
