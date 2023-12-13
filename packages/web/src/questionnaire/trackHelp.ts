import type { Track } from '@/types'
import { PublicodesTrackHelpValue, Questionnaire, TrackComponents, TrackHelpValue, TrackId } from '@/types'

export const help: Track = {
  id: TrackId.Help,
  category: 'ourHelp',
  title: { fr: 'Par où commencer ?' },
  label: { fr: 'Comment pouvons-nous vous aider ?' },
  callout: {
    bgColor: '#FACF35', // 'fr-callout--green-emeraude',
    title: { fr: 'En avant !' },
    bigTitle: false,
    imageLeft: 'images/TEE-onboarding.png',
    description: {
      fr: 'Nous allons vous poser quelques questions pour pouvoir identifier les accompagnements et les financements dont vous pouvez bénéficier.'
    },
    hintIcon: 'fr-icon-timer-line'
  },
  interface: {
    component: TrackComponents.Cards,
    columnWidth: 6
  },
  behavior: {
    multipleChoices: false
  },
  next: {
    default: TrackId.Results
  },
  options: [
    {
      value: {
        user_help: TrackHelpValue.Unknown,
        [Questionnaire.path]: PublicodesTrackHelpValue.Unknown
      },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Je ne sais pas par où commencer' },
      resume: {
        fr: 'Faisons un état des lieux à 360° sur votre empreinte carbone : énergie, eau, déchets, mobilité...'
      },
      hintImage: { fr: '5 min. chrono !' },
      hintImageIcon: 'fr-icon-timer-line',
      imageTop: 'images/tracks/je-ne-sais-pas-par-ou-commencer.svg',
      next: {
        default: TrackId.Siret
      }
    },
    {
      value: {
        user_help: TrackHelpValue.Precise,
        [Questionnaire.path]: PublicodesTrackHelpValue.Precise
      },
      title: { fr: "J'ai un objectif" },
      label: { fr: "J'ai un objectif précis en tête" },
      resume: {
        fr: 'Trouvons les accompagnements et financements qui peuvent vous aider à réaliser votre projet'
      },
      hintImage: { fr: '2 min. chrono !' },
      hintImageIcon: 'fr-icon-timer-line',
      imageTop: 'images/tracks/j-ai-un-obectif.svg',
      next: {
        default: TrackId.Siret
      }
    }
  ]
}
