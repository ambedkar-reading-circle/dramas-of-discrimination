import { workshopActivities } from '#/pages/home/workshop-method'
import type { Slide } from '../../types'
import { MethodEmbed } from './MethodEmbed'

/** The five act names, reused from the workshop-method data the embed renders. */
const actDisplayNames: Record<string, string> = {
  IntroTime: 'Intro Time',
  PartTime: 'Part-Time A/B',
  StoryTime: 'Story Time',
  PlayTime: 'Playtime',
  OverTime: 'Overtime',
}

export const slide = {
  id: '06',
  kicker: 'The method',
  heading: 'The Workshop in five acts',
  body: (
    <p className="slide-acts" aria-label={workshopActivities.map((activity) => actDisplayNames[activity.name] ?? activity.name).join(', then ')}>
      {workshopActivities.map((activity, index) => (
        <span key={activity.name}>
          {index > 0 && (
            <span className="slide-acts-arrow" aria-hidden="true">
              {' → '}
            </span>
          )}
          {actDisplayNames[activity.name] ?? activity.name}
        </span>
      ))}
    </p>
  ),
  interactive: <MethodEmbed />,
} satisfies Slide
