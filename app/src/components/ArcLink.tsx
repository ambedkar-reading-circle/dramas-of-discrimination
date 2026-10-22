export const ARC_WEBSITE_URL = 'https://arc-community.in'

export default function ArcLink({ children, className, ariaLabel }: { children: React.ReactNode; className?: string; ariaLabel?: string }) {
  return (
    <a href={ARC_WEBSITE_URL} target="_blank" rel="noopener noreferrer" className={className} aria-label={ariaLabel}>
      {children}
    </a>
  )
}
