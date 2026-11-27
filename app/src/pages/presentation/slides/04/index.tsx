import { cuesOf } from '../../playback/cues'
import type { Slide } from '../../types'
import { MissionBoard } from './MissionBoard'

const mission = cuesOf('mission')

export const slide = {
  id: '04',
  kicker: 'The mission',
  heading: 'What the tool sets out to do',
  body: <MissionBoard />,
  layout: 'centered',
  speakerNotes: [
    'Back to Dramas of Discrimination itself. What it is for, and what it can hold.',
    'It sets out to make the work environment more just and more inclusive, through interactive and participatory methods.',
    'Its aim is to cultivate, and to advocate for, proactive engagement in addressing caste-based discrimination in Indian workplaces.',
    mission('motivation'),
    'So, at heart, it is a platform for rehearsing change. A space where a different ending can be tried before it is needed.',
    mission('gathers'),
    'Along the way, it does something quieter. It gauges and gathers the collective caste consciousness of the people taking part.',
    mission(null),
    'First, articulation. How does a diverse community recognise and name instances of caste-based discrimination, especially the ones that are rarely said out loud?',
    'Second, intervention. In a discriminatory situation, what are the many ways people might respond? Confronting it, negotiating around it, or quietly shifting the scene.',
    mission('thomas-business'),
    'R. Roosevelt Thomas Jr., often called the father of diversity management, made the business case in 1990. “In business terms,” he wrote, “a diverse work force is not something your company ought to have; it’s something your company does have, or soon will have.”',
    mission(null),
    'Laws can bring people in, but they cannot finish the work.',
    mission('thomas-fuel'),
    'In his words, affirmative action “gets the new fuel into the tank, the new people through the front door. Something else will have to get them into the driver’s seat.”',
    mission(null),
    'Why gather this together, rather than hand down rules?',
    mission('dobbin-title'),
    'The sociologists Frank Dobbin and Alexandra Kalev analysed three decades’ worth of company data.',
    mission('dobbin-rules'),
    'They found that rules can provoke resistance. In their words, “laboratory studies show that this kind of force-feeding can activate bias rather than stamp it out,” and “people often rebel against rules to assert their autonomy.”',
    mission('dobbin-champions'),
    'What works better is engaging people in solving the problem. “When managers actively help boost diversity in their companies,” they write, “… they begin to think of themselves as diversity champions.”',
    mission('result'),
    'That is the hope here too. A community that helps build its own inclusion has a reason to protect it.',
    mission('thomas-reality'),
    'Or, as Thomas put it, “It’s our reality. We need to make it our strength.”',
  ],
} satisfies Slide
