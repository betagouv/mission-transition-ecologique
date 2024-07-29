import type { Track } from '@/types'
import { Objective, TrackComponent, TrackId } from '@/types'

export const goals: Track = {
  id: TrackId.Goals,
  category: 'myEntreprise',
  title: { fr: 'Mes objectifs' },
  label: { fr: 'Choisissez la thématique de votre projet :' },
  interface: {
    component: TrackComponent.Themes
  },
  behavior: {
    multipleChoices: false
  },
  next: {
    default: TrackId.Results
  },
  options: [
    {
      value: Objective.EnergyPerformance,
      questionnaireData: { priority_objective: Objective.EnergyPerformance },
      title: { fr: "Gestion de l'énergie" },
      label: { fr: '⚡️ Améliorer la performance énergétique de mon entreprise' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: Objective.BuildingRenovation,
      questionnaireData: { priority_objective: Objective.BuildingRenovation },
      title: { fr: 'Rénovation du bâtiment' },
      label: { fr: '🏢 Rénover mon bâtiment' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: Objective.SustainableMobility,
      questionnaireData: { priority_objective: Objective.SustainableMobility },
      title: { fr: 'Mobilité durable' },
      label: { fr: '🚲 Engager une démarche de mobilité durable' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: Objective.WaterConsumption,
      questionnaireData: { priority_objective: Objective.WaterConsumption },
      title: { fr: "Gestion de l'eau" },
      label: { fr: "💧 Diminuer ma consommation d'eau" },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: Objective.EcoDesign,
      questionnaireData: { priority_objective: Objective.EcoDesign },
      title: { fr: 'Eco-conception' },
      label: { fr: '🏭 Améliorer la performance environnementale de mes produits et services' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: Objective.WasteManagement,
      questionnaireData: { priority_objective: Objective.WasteManagement },
      title: { fr: 'Gestion des déchets' },
      label: { fr: '🗑 Mieux gérer mes déchets' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: Objective.TrainOrRecruit,
      questionnaireData: { priority_objective: Objective.TrainOrRecruit },
      title: { fr: 'Formation' },
      label: { fr: '🧑‍🎓 Former ou recruter sur la transition écologique' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: Objective.EnvironmentalImpact,
      questionnaireData: { priority_objective: Objective.EnvironmentalImpact },
      title: { fr: 'Impact environnemental' },
      label: { fr: '🌱 Mesurer mon impact environnemental et le réduire' },
      next: {
        default: TrackId.Results
      }
    }
  ]
}
