import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'
import type { ReactNode } from 'react'

type ActionButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'quiet'
  icon?: ReactNode
} & ({ href: string; to?: never } | { to: NonNullable<LinkProps['to']>; href?: never })

// These button-style actions navigate, so retain native link semantics.
export default function ActionButton({ children, variant = 'primary', icon, ...destination }: ActionButtonProps) {
  const className = `action-link action-link-${variant}`
  const content = (
    <>
      <span className="notebook-text">{children}</span>
      {icon && (
        <span className="notebook-text" aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  )

  if (destination.href !== undefined) {
    return (
      <a href={destination.href} className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link to={destination.to} className={className}>
      {content}
    </Link>
  )
}
