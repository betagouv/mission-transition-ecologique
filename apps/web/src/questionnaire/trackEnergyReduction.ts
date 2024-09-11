import { Objective, type Track, TrackComponent, TrackId, YesNo } from '@/types'

export const energyReductionPriority: Track = {
  id: TrackId.EnergyReductionPriority,
  category: 'myEnergy',
  title: { fr: 'Réduction de la consommation' },
  label: { fr: 'La réduction de vos consommations d’énergie est-elle une priorité pour vous ?' },
  theme: Objective.EnergyPerformance,
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
      questionnaireData: { energy_reduction_objective: YesNo.Yes },
      title: { fr: 'Oui' },
      label: { fr: '👍 Oui, c’est une priorité' },
      next: {
        default: TrackId.StrategyAudits
      }
    },
    {
      value: YesNo.No,
      questionnaireData: { energy_reduction_objective: YesNo.No },
      title: { fr: 'Non' },
      label: { fr: '❌ Ce n’est pas ma priorité' },
      next: {
        default: TrackId.StrategyAudits
      }
    },
    {
      value: YesNo.Unknown,
      questionnaireData: { energy_reduction_objective: YesNo.Unknown },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Je ne sais pas' },
      next: {
        default: TrackId.StrategyAudits
      }
    }
  ]
}
