export const buildingProperty = {
  id: 'track_structure_building_property',
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
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  next: {
    default: 'track_results'
  },
  options: [
    {
      value: { structure_building_property: 'owns' },
      title: { fr: 'Propriétaire' },
      label: { fr: "🔑 Propriétaire" },
      next: {
        default: 'track_structure_building_surface'
      }
    },
    {
      value: { structure_building_property: 'rents' },
      title: { fr: "Locataire" },
      label: { fr: "📝 Locataire " },
      next: {
        default: 'track_structure_building_surface'
      }
    },
    {
      value: { structure_building_property: 'owns_and_rents' },
      title: { fr: 'Propriétaire & locataire' },
      label: { fr: "Je suis à la fois propriétaire et locataire sur mes différents locaux" },
      next: {
        default: 'track_structure_building_surface'
      }
    }
  ]
}