import type { Slide } from '../../types'
import { FlipCard } from './FlipCard'

export const slide = {
  id: '06',
  kicker: 'Two capacities',
  heading: 'What the Workshop measures',
  body: <p className="section-lede-copy">Two capacities a Community carries out of the room. Turn each card over.</p>,
  interactive: (
    <div className="slide-flip-grid">
      <FlipCard title="Articulation capacity" front="Can the Group say what happened, and to whom?" back="The Actor map and Play script sharpen a Group’s ability to articulate a Scenario — Actors, Ideal behaviours, Failures, and the Dialogues that show them." />
      <FlipCard title="Intervention capacity" front="What does the Group dare to do when it steps in?" back="PlayTime’s repeated interventions grow a repertoire the Community carries out of the room — measured by what Members try next." />
    </div>
  ),
  layout: 'grid',
} satisfies Slide
