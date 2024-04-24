import { PublicodeObjective, type Track, TrackComponent, TrackId, YesNo } from '@/types'
import Objective from '@/utils/Objective'

export const energyReductionPriority: Track = {
  id: TrackId.EnergyReductionPriority,
  category: 'myEnergy',
  title: { fr: 'Réduction de la consommation' },
  label: { fr: 'La réduction de vos consommations d’énergie est-elle une priorité pour vous ?' },
  objective: PublicodeObjective.EnergyPerformance,
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: #3A3A3A;',
    bgColor: '#FACF35',
    title: { fr: "Votre gestion de l'énergie" },
    titleStyle: 'color: #000091;',
    bigTitle: true,
    imageLeft: Objective.getImageByObjective(PublicodeObjective.EnergyPerformance)
  },
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
