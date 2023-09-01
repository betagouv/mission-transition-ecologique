export const buildingProperty = {
  id: 'track_structure_building_property',
  category: 'building',
  title: { fr: 'Mes bâtiments' },
  label: { fr: "Parlons de vos locaux. Vous êtes :" },
  callout: {
    header: { fr: 'Thématique' },
    headerStyle: 'color: white; font-weight: 400; font-size: 1.3rem; margin-bottom: auto;',
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