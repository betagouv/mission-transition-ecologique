import type { Track } from '@/types'
import { TrackComponent, TrackId } from '@/types'

export const wastesSorting: Track = {
  id: TrackId.WastesSorting,
  category: 'myWastes',
  title: { fr: 'Tri des déchets' },
  label: { fr: 'Avez-vous mis en place une solution de tri des déchets dans votre entreprise ?' },
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
      value: { wastes_sorting: 'yes' },
      title: { fr: 'Oui' },
      label: { fr: '✅ Oui, j’ai déjà mis en place un système de tri' },
      next: {
        default: TrackId.WastesMaterials
      }
    },
    {
      value: { wastes_sorting: 'can do better' },
      title: { fr: 'Je peux faire mieux' },
      label: { fr: '🗑 Je peux faire mieux !' },
      next: {
        default: TrackId.WastesMaterials
      }
    },
    {
      value: { wastes_sorting: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Je ne sais pas' },
      next: {
        default: TrackId.WastesMaterials
      }
    }
  ]
}
