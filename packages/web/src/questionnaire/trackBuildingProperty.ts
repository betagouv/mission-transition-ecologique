import type { Track } from '@/types'
import { TrackComponents, TrackId } from '@/types'

export const buildingProperty: Track = {
  id: TrackId.BuildingProperty,
  category: 'myBuildings',
  title: { fr: 'Mon statut' },
  label: { fr: "Parlons de vos locaux. Vous êtes :" },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: white;',
    bgColor: '#6672F8',
    title: { fr : 'Zoom sur vos bâtiments' },
    titleStyle: 'color: white;',
    bigTitle: true,
    imageLeft: 'images/thema/thema-batiments.svg',
  },
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
      value: { structure_building_property: 'owns' },
      title: { fr: 'Propriétaire' },
      label: { fr: "🔑 Propriétaire" },
      next: {
        default: TrackId.Mobility
      }
    },
    {
      value: { structure_building_property: 'rents' },
      title: { fr: "Locataire" },
      label: { fr: "📝 Locataire " },
      next: {
        default: TrackId.Mobility
      }
    },
    {
      value: { structure_building_property: 'owns_and_rents' },
      title: { fr: 'Propriétaire & locataire' },
      label: { fr: "Je suis à la fois propriétaire et locataire sur mes différents locaux" },
      next: {
        default: TrackId.Mobility
      }
    }
  ]
}
