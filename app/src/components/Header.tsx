import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import DodLogo from './DodLogo'
import ThemeToggle from './ThemeToggle'
import { useRoughAnnotation } from '#/lib/rough-notation/useRoughAnnotation'
import type { RoughAnnotationConfig } from '#/lib/rough-notation'

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/about', label: 'About', exact: false },
] as const

type NavEntry = (typeof navLinks)[number]

const annotationConfig: RoughAnnotationConfig = {
  type: 'box',
  brackets: ['left', 'right'],
  color: 'currentColor',
  strokeWidth: 1,
  padding: 6,
  animationDuration: 350,
  hideDuration: 200,
}

function NavLink({ link }: { link: NavEntry }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const active = link.exact ? pathname === link.to : pathname.startsWith(link.to)
  const labelRef = useRef<HTMLSpanElement>(null)
  const { show, hide } = useRoughAnnotation(labelRef, annotationConfig)

  // The active route keeps its brackets drawn; routes losing active retract.
  useEffect(() => {
    if (active) {
      show()
    } else {
      hide()
    }
  }, [active, show, hide])

  const linkClassName = `inline-flex items-center justify-center min-h-11 min-w-11 text-[0.9375rem] no-underline relative hover:text-ink ${active ? 'text-ink' : 'text-ink-soft'}`

  return (
    <Link
      to={link.to}
      activeOptions={link.exact ? { exact: true } : undefined}
      className={linkClassName}
      onPointerEnter={() => show()}
      onPointerLeave={() => {
        if (!active) hide()
      }}
      onFocus={(e) => {
        if (e.currentTarget.matches(':focus-visible')) show()
      }}
      onBlur={() => {
        if (!active) hide()
      }}
    >
      <span ref={labelRef} className="notebook-text top-0">
        {link.label}
      </span>
    </Link>
  )
}

export default function Header() {
  const header = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const element = header.current
    if (!element) return
    const root = document.documentElement
    const measure = () => root.style.setProperty('--site-header-height', `${element.getBoundingClientRect().height}px`)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--site-header-height')
    }
  }, [])

  return (
    <header ref={header} className="site-foreground sticky top-0 paper-tear paper-tear--bottom">
      <div className="paper-tear__surface" aria-hidden="true" />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <nav className="page-wrap grid items-stretch grid-cols-[minmax(0,1fr)_auto] gap-x-row pt-[calc(var(--notebook-row)/4)] md:grid-cols-3 md:gap-x-gutter" aria-label="Primary navigation">
        <div className="col-start-1 row-start-1 min-w-0 max-md:wrap-anywhere">
          <Link to="/" className="flex items-center h-full min-h-11 max-w-full no-underline" aria-label="Dramas of Discrimination home">
            <DodLogo variant="inline" />
          </Link>
        </div>

        <div className="col-span-2 row-start-2 flex min-w-0 flex-wrap items-center justify-center gap-x-row md:col-start-2 md:row-start-1 md:col-span-1 max-md:gap-x-[min(var(--notebook-row),4vw)]">
          {navLinks.map((link) => (
            <NavLink key={link.to} link={link} />
          ))}
        </div>

        <div className="col-start-2 row-start-1 flex items-center self-stretch justify-self-end md:col-start-3">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
