import type { Track } from '@/types'
import { TrackComponent, TrackId } from '@/types'

export const status: Track = {
  id: TrackId.Status,
  category: 'goals',
  title: { fr: "Mon niveau d'avancement" },
  label: { fr: 'Statut de votre projet' },
  interface: {
    component: TrackComponent.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      value: { project_status: 'economies' },
      title: { fr: 'Economies' },
      label: { fr: 'Je veux faire des économies' },
      next: {
        default: TrackId.StructureSizes
      }
    },
    {
      value: { project_status: 'carbon' },
      title: { fr: 'Emissions carbone' },
      label: { fr: "J'ai besoin de connaître et réduire mes émissions carbone" },
      next: {
        default: TrackId.Results
      }
    },
    {
      value: { project_status: 'improve' },
      title: { fr: 'Améliorer mon produit/service' },
      label: { fr: "J'ai besoin d'améliorer mon produit/service" },
      next: {
        default: TrackId.Results
      }
    }
  ]
}
