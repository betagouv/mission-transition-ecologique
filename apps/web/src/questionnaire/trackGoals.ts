import { ThemeId, TrackComponent, TrackId, TrackCategory, Track } from '@/types'

export const goals: Track = {
  id: TrackId.Goals,
  category: TrackCategory.myEntreprise,
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
      value: ThemeId.Energy,
      questionnaireData: { priority_objective: ThemeId.Energy },
      title: { fr: "Gestion de l'énergie" },
      label: { fr: '⚡️ Améliorer la performance énergétique de mon entreprise' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: ThemeId.Building,
      questionnaireData: { priority_objective: ThemeId.Building },
      title: { fr: 'Rénovation du bâtiment' },
      label: { fr: '🏢 Rénover mon bâtiment' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: ThemeId.Mobility,
      questionnaireData: { priority_objective: ThemeId.Mobility },
      title: { fr: 'Mobilité durable' },
      label: { fr: '🚲 Engager une démarche de mobilité durable' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: ThemeId.Water,
      questionnaireData: { priority_objective: ThemeId.Water },
      title: { fr: "Gestion de l'eau" },
      label: { fr: "💧 Diminuer ma consommation d'eau" },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: ThemeId.EcoDesign,
      questionnaireData: { priority_objective: ThemeId.EcoDesign },
      title: { fr: 'Eco-conception' },
      label: { fr: '🏭 Améliorer la performance environnementale de mes produits et services' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: ThemeId.Waste,
      questionnaireData: { priority_objective: ThemeId.Waste },
      title: { fr: 'Gestion des déchets' },
      label: { fr: '🗑 Mieux gérer mes déchets' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: ThemeId.RH,
      questionnaireData: { priority_objective: ThemeId.RH },
      title: { fr: 'Formation' },
      label: { fr: '🧑‍🎓 Former ou recruter sur la transition écologique' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: ThemeId.Environmental,
      questionnaireData: { priority_objective: ThemeId.Environmental },
      title: { fr: 'Impact environnemental' },
      label: { fr: '🌱 Mesurer mon impact environnemental et le réduire' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: ThemeId.Biodiversity,
      questionnaireData: { priority_objective: ThemeId.Biodiversity },
      title: { fr: 'Biodiversité' },
      label: { fr: 'Préserver la biodiversité' },
      next: {
        default: TrackId.Results
      }
    }
  ]
}
