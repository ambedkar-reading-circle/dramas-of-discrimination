import { useThemeMode } from './useThemeMode'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode()

  const label = mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button type="button" onClick={toggleMode} aria-label={label} title={label} className="theme-toggle">
      <span className="theme-toggle-eclipse" aria-hidden="true">
        <span className="theme-toggle-window">
          <span className="theme-toggle-orbit">
            <span className="theme-toggle-circle theme-toggle-circle-blue" />
            <span className="theme-toggle-circle theme-toggle-circle-white" />
          </span>
        </span>
      </span>
    </button>
  )
}
