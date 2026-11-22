import './styles.css'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'

createRoot(document.getElementById('app')!).render(<RouterProvider router={getRouter()} />)

if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('notebook-grid')) {
  void import('./dev/notebook-debug')
}
