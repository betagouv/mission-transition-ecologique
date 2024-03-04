import { Objectives, priorityObjectives, YesNo, TrackComponent, TrackId } from '@/types'
import type { Track } from '@/types'

export const goals: Track = {
  id: TrackId.Goals,
  category: 'myEntreprise',
  title: { fr: 'Mes objectifs' },
  label: { fr: 'Quel est votre objectif prioritaire ?' },
  hint: { fr: 'Je souhaite...' },
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
      // WIP
      value: {
        ...priorityObjectives,
        [Objectives.EnvironmentalImpact]: YesNo.Yes
      },
      title: { fr: 'Impact environnemental' },
      label: { fr: '🌱 Mesurer mon impact environnemental et le réduire' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: {
        ...priorityObjectives,
        [Objectives.EnergyPerformance]: YesNo.Yes
      },
      title: { fr: "Gestion de l'énergie" },
      label: { fr: '⚡️ Améliorer la performance énergétique de mon entreprise' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: {
        ...priorityObjectives,
        [Objectives.WaterConsumption]: YesNo.Yes
      },
      title: { fr: "Gestion de l'eau" },
      label: { fr: "💧 Diminuer ma consommation d'eau" },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: {
        ...priorityObjectives,
        [Objectives.BuildingRenovation]: YesNo.Yes
      },
      title: { fr: 'Rénovation du bâtiment' },
      label: { fr: '🏢 Rénover mon bâtiment' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: {
        ...priorityObjectives,
        [Objectives.SustainableMobility]: YesNo.Yes
      },
      title: { fr: 'Mobilité durable' },
      label: { fr: '🚲 Engager une démarche de mobilité durable' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: {
        ...priorityObjectives,
        [Objectives.WasteManagement]: YesNo.Yes
      },
      title: { fr: 'Gestion des déchets' },
      label: { fr: '🗑 Mieux gérer mes déchets' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: {
        ...priorityObjectives,
        [Objectives.EcoDesign]: YesNo.Yes
      },
      title: { fr: 'Eco-conception' },
      label: { fr: '🏭 Améliorer la performance environnementale de mes produits et services' },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: {
        ...priorityObjectives,
        [Objectives.TrainOrRecruit]: YesNo.Yes
      },
      title: { fr: 'Formation' },
      label: { fr: '🧑‍🎓 Former ou recruter sur la transition écologique' },
      next: {
        default: TrackId.Results
      }
    },

    // LEGACY OPTIONS
    // USEFUL FOR DEBUGGING
    {
      disabled: true,
      value: {
        ...priorityObjectives,
        [Objectives.MakeSavings]: YesNo.Yes
      },
      title: { fr: 'Economies' },
      label: {
        fr: '💶 Faire des économies en réduisant nos pertes en énergie, matière, déchets et eau'
      },
      next: {
        default: TrackId.Results
      }
    },
    {
      disabled: true,
      value: {
        ...priorityObjectives,
        [Objectives.DurablyInvest]: YesNo.Yes
      },
      title: { fr: 'Consolider mon projet' },
      label: { fr: "📂 Consolider mon projet d'investissement durable" },
      next: {
        default: TrackId.Results
      }
    },
    {
      disabled: true,
      value: {
        ...priorityObjectives,
        [Objectives.UnknownYet]: YesNo.Yes
      },
      title: { fr: 'Autre' },
      label: { fr: '💁 Je ne sais pas encore' },
      next: {
        default: TrackId.Results
      }
    }
  ]
}
