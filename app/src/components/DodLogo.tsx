export default function DodLogo({
  variant = 'hero',
}: {
  variant?: 'hero' | 'inline'
}) {
  if (variant === 'inline') {
    return (
      <span className="inline-block text-[1.25em] leading-[1em] text-left">
        Dramas
        <span className="font-of text-[2.5em] leading-[1em] p-[2px]">of </span>
        Discrimination
      </span>
    )
  }

  return (
    <span className="block text-[1.25em] leading-[1.2em] antialiased">
      Dramas<span className="font-of text-[2.5em] leading-[1rem] p-2">of </span>
      <br />
      Discrimination
    </span>
  )
}
