import type { Track } from '@/types'
import { TrackComponents, TrackId } from '@/types'

export const buildingSurface: Track = {
  id: TrackId.BuildingSurface,
  category: 'myBuildings',
  title: { fr: 'La surface' },
  label: { fr: "Quelle est la surface de vos locaux ?" },
  interface: {
    component: TrackComponents.Buttons,
  },
  behavior: {
    multipleChoices: false,
  },
  next: {
    default: TrackId.Results
  },
  options: [
    {
      value: { structure_building_surface: '-1000m2' },
      title: { fr: '< 1 000 m2' },
      label: { fr: "🏠 Inférieur à 1 000 m2" },
      next: {
        default: TrackId.Mobility
      }
    },
    {
      value: { structure_building_surface: '+1000m2' },
      title: { fr: '> 1 000 m2' },
      label: { fr: "🏢 Supérieur à 1 000 m2" },
      next: {
        default: TrackId.Mobility
      }
    },
    {
      value: { structure_building_surface: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Je ne sais pas" },
      next: {
        default: TrackId.Mobility
      }
    }
  ]
}
