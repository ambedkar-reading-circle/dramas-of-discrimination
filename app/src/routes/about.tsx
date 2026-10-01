import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})
function About() {
  return (
    <main className="page-wrap flex flex-1 flex-col px-4 py-12">
      <section className="island-shell p-6 sm:p-8">
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-3 text-4xl text-[var(--sea-ink)] sm:text-5xl">
          From discrimination scenarios to policy manifestos.
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          Small groups take a chosen discrimination scenario and map it out
          twice: first as a table of actors, ideal behaviors, and failures; then
          as a play-script graph where dialogues expose those failures. An LLM
          turns the result into a draft policy manifesto, the group refines it,
          and — on consensus — it is published here for the public.
        </p>
      </section>
    </main>
  )
}
