import { workshopActivities } from '#/pages/home/workshop-method'
import type { Slide } from '../../types'
import { MethodEmbed } from './MethodEmbed'

/** What to say over each act. An act left out shows placeholder points. */
const notesByAct: Readonly<Record<string, ReadonlyArray<string>>> = {
  IntroTime: [
    'IntroTime has one aim: to ground the workshop in lived experience, before any analysis begins.',
    'So the check-in asks each person for one example of caste privilege they have seen or lived. The rest of the workshop gives most of its attention to discrimination. So it is imperative, right at the start, to name privilege and learn to recognise it. The check-in becomes a tone-setting exercise for the whole workshop.',
    'Identifying details are optional. That makes it safe to say something true.',
    'And because everyone speaks once, every voice is in the room before the discussion opens.',
  ],
  PartTime: [
    'PartTime moves the room from pairs to groups, and from personal stories to a shared map. Along the way it defines discrimination, shows it as a system of actors, and finds where each of them can intervene.',
    'First, people pair up with the person beside them, a first step towards forming groups. Each pair shares two examples of discrimination: a reward that was downplayed, and a penalty or punishment that was overplayed.',
    'These two forms work as a definition of discrimination. They also help people warm up to it, through stories they have lived or witnessed.',
    'And they keep the talk from shrinking into a reservation debate, or into a condescending tone of “helping” the oppressed. The goal is to share resources and power justly.',
    'Then, ideally, the whole room divides into three groups. The pairs scatter, so each group is mixed. Enough examples have been shared by now that each group can pick one scenario, and everyone is already warmed up.',
    'Each group dissects its scenario into an actor map: who is involved, what each should ideally do, and what stops them. Every failure becomes a place for intervention, with a role for everyone, not only for the person facing discrimination.',
    'And each situation is tied to the Constitution. Groups mark which of Justice, Liberty, Equality and Fraternity it violates. That gives everyone a shared ground to argue from.',
  ],
  StoryTime: [
    'StoryTime turns the PartTime actor map into a play script. The failures in its third column, the hurdles that keep each actor from their ideal role, are now written as dialogue and interactions between the players.',
    'At the centre sits the member of the oppressed caste community, and every interaction is drawn out from there. The script becomes an actor map, so everyone can visualise and articulate the network of the system around that one person.',
    'If the scene also turns on place of birth, religion or gender, groups tick it on the sheet: other grounds protected by Articles 15 and 16.',
    'The scene ends unresolved. The group that wrote it has, in a sense, already solved it: the middle column of its PartTime sheet maps the ideal roles that would prevent the discrimination. But the other groups have spent the same time on their own examples, and have not discussed this one. So in PlayTime they step in as spect-actors and propose solutions of their own. That allows for enough cross-pollination between the groups.',
  ],
  PlayTime: [
    'PlayTime brings the script to life. Before the groups perform, the facilitators stage a short sample skit, an auto driver and a traffic police officer, and replay it with someone stepping in. From then on the stage passes to the room, and facilitators intervene as little as possible.',
    'Each group performs its scene for about five minutes, as written, unresolved, for the other groups to witness.',
    'Then the others step in as spect-actors. Anyone can raise a hand, take over an existing actor or add a new one, and try an intervention at the moment they choose. About fifteen minutes per group.',
    'Each intervention lands on one of the hurdles from the actor map. So the room tests, in practice, what it would take for an actor to fulfil their ideal role.',
  ],
  OverTime: [
    'OverTime is the debrief. It holds on to what the room learned, and admits what a rehearsal cannot simulate. It is led by four questions.',
    'First, the real world. This room was safe and self-selected; outside, an intervention can backfire or cost dearly. So what further preparation would it take?',
    'Second, back to the actor map. What stopped each actor from upholding the constitutional values in their own setting, and what would help or motivate them to?',
    'Third, selective inclusion. We often read Articles 15 and 16 one ground at a time, as only caste or only gender. Where do our diversity, equity and inclusion efforts do that?',
    'And last, after a whole day on discrimination, the room tries to define it together, plainly enough to name it and act on it without hesitation.',
  ],
}

export const slide = {
  id: '05',
  kicker: 'The method',
  heading: 'The five acts of the Workshop',
  interactive: <MethodEmbed />,
  speakerNoteTabs: workshopActivities.map((activity) => ({ label: activity.name, speakerNotes: notesByAct[activity.name] })),
} satisfies Slide
