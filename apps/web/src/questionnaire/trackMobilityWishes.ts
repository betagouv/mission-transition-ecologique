import { MobilityStatus, TrackComponent, TrackId, YesNo, Objective, Track, TrackCategory } from '@/types'

export const mobilityWishes: Track = {
  id: TrackId.MobilityWishes,
  category: TrackCategory.myMobility,
  title: { fr: 'Mobilité douce' },
  label: {
    fr: 'Souhaitez-vous favoriser des déplacements plus écologiques pour vous et vos employés ?'
  },
  objective: Objective.SustainableMobility,
  interface: {
    component: TrackComponent.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  next: {
    default: TrackId.WastesStake
  },
  options: [
    {
      value: YesNo.Yes,
      questionnaireData: { sustainable_mobility_objective: MobilityStatus.Yes },
      title: { fr: 'Oui' },
      label: { fr: "👏 Oui, ça m'intéresse !" },
      next: {
        default: TrackId.WastesStake
      }
    },
    {
      value: 'maximum',
      questionnaireData: { sustainable_mobility_objective: MobilityStatus.NoMax },
      title: { fr: 'Non, on fait le maximum' },
      label: { fr: '🚲 Non, on fait déjà le maximum sur le sujet' },
      next: {
        default: TrackId.WastesStake
      }
    },
    {
      value: 'pas un enjeu',
      questionnaireData: { sustainable_mobility_objective: MobilityStatus.No },
      title: { fr: 'Non, pas un enjeu' },
      label: { fr: "❌ Non, ce n'est pas un enjeu pour moi" },
      next: {
        default: TrackId.WastesStake
      }
    },
    {
      value: YesNo.Unknown,
      questionnaireData: { sustainable_mobility_objective: MobilityStatus.Unknown },
      title: { fr: 'Ne sais pas' },
      label: { fr: 'Aucune idée' },
      next: {
        default: TrackId.WastesStake
      }
    }
  ]
}
