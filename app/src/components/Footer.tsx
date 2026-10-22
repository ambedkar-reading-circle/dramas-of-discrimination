import ArcLink from './ArcLink'
import ARCLogo from './ARCLogo'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer site-foreground paper-tear paper-tear--top">
      <div className="paper-tear__surface" aria-hidden="true" />
      <div className="page-wrap grid grid-cols-[1fr_auto] gap-gutter items-start py-[calc(2*var(--notebook-row))] max-md:grid-cols-1 max-md:gap-row">
        <div className="flex items-start gap-row">
          <ARCLogo />
          <div>
            <p className="eyebrow m-0">
              <ArcLink>Ambedkar Reading Circle</ArcLink>, Bangalore
            </p>
            <p className="max-w-[50ch] text-[0.9375rem] text-ink-soft">Open-source tools for communities rehearsing equality and fraternity.</p>
          </div>
        </div>
        <div className="self-start text-right text-[0.8125rem] text-ink-soft max-md:text-left">
          <p>
            &copy; {year} <ArcLink>Ambedkar Reading Circle</ArcLink>
          </p>
          <p>Open source · AGPL-3.0</p>
        </div>
      </div>
    </footer>
  )
}
