import { TrackComponent, TrackId, YesNo, ThemeId, Track, TrackCategory } from '@/types'

export const waterStake: Track = {
  id: TrackId.WaterStake,
  category: TrackCategory.myWater,
  title: { fr: 'Enjeu' },
  label: { fr: "Pensez-vous avoir un enjeu important sur votre consommation d'eau ?" },
  theme: ThemeId.Water,
  interface: {
    component: TrackComponent.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  next: {
    default: TrackId.Results
  },
  options: [
    {
      value: YesNo.Yes,
      questionnaireData: { water_reduction_objective: YesNo.Yes },
      title: { fr: 'Oui' },
      label: { fr: "👍 Oui, je pense que c'est un enjeu pour mon entreprise" },
      next: {
        default: TrackId.EnergyReductionPriority
      }
    },
    {
      value: YesNo.No,
      questionnaireData: { water_reduction_objective: YesNo.No },
      title: { fr: 'Non' },
      label: { fr: '👎 Non, pas vraiment' },
      next: {
        default: TrackId.EnergyReductionPriority
      }
    },
    {
      value: YesNo.Unknown,
      questionnaireData: { water_reduction_objective: YesNo.Unknown },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Aucune idée !' },
      next: {
        default: TrackId.EnergyReductionPriority
      }
    }
  ]
}
