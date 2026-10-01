export default function ArcLogo({ size = 100 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center rounded-md border-[0.25px] border-[var(--primary-blue)] bg-[var(--primary-white)] p-1">
      <img
        src="/ARCLogo-blue.png"
        alt="arc-logo"
        width={size}
        height={size}
      />
    </div>
  )
}
