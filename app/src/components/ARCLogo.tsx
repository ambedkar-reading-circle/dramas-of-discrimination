import ArcLink from './ArcLink'

export default function ARCLogo() {
  return (
    <ArcLink className="inline-flex flex-none bg-(--primary-white) p-1 h-[calc(2*var(--notebook-row))] overflow-hidden rounded-[5px] [&_img]:size-full [&_img]:object-contain" ariaLabel="Ambedkar Reading Circle (opens in a new tab)">
      <img src="/ARCLogo-blue.png" alt="Ambedkar Reading Circle" />
    </ArcLink>
  )
}
