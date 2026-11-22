import ActionButton from '#/components/ActionButton'

export default function TeamJoinNote() {
  return (
    <section className="notebook-section page-wrap">
      <div className="section-lede">
        <p className="eyebrow">Build with us</p>
        <h2>The manual is open. So is the team.</h2>
      </div>
      <p className="max-w-[65ch] text-ink-soft">The facilitator videos for the web app will be recorded with theatre and film collaborators, and the app itself is built through collaborative open-source coding. If you are an engineer from a community this workshop is for, pitch in: the code lives on the collective's GitHub organisation, and the workshop keeps growing in public.</p>
      <div className="mt-row">
        <ActionButton href="https://github.com/ambedkar-reading-circle">Contribute on GitHub</ActionButton>
      </div>
    </section>
  )
}
