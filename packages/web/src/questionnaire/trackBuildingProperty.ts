import { PublicodeObjective, Track } from '@/types'
import { TrackComponent, TrackId, BuildingProperty } from '@/types'
import Objective from '@/utils/Objective'

export const buildingProperty: Track = {
  id: TrackId.BuildingProperty,
  category: 'myBuildings',
  title: { fr: 'Mon statut' },
  label: { fr: 'Parlons de vos locaux. Vous êtes :' },
  objective: PublicodeObjective.BuildingRenovation,
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: white;',
    bgColor: '#6672F8',
    title: { fr: 'Zoom sur vos bâtiments' },
    titleStyle: 'color: white;',
    bigTitle: true,
    imageLeft: Objective.getImageByObjective(PublicodeObjective.BuildingRenovation)
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
      value: BuildingProperty.Owns,
      questionnaireData: { building_property: BuildingProperty.Owns },
      title: { fr: 'Propriétaire' },
      label: { fr: '🔑 Propriétaire' },
      next: {
        default: TrackId.MobilityWishes
      }
    },
    {
      value: BuildingProperty.Rents,
      questionnaireData: { building_property: BuildingProperty.Rents },
      title: { fr: 'Locataire' },
      label: { fr: '📝 Locataire ' },
      next: {
        default: TrackId.MobilityWishes
      }
    },
    {
      value: BuildingProperty.OwnsAndRents,
      questionnaireData: { building_property: BuildingProperty.OwnsAndRents },
      title: { fr: 'Propriétaire & locataire' },
      label: { fr: 'Je suis à la fois propriétaire et locataire sur mes différents locaux' },
      next: {
        default: TrackId.MobilityWishes
      }
    }
  ]
}
