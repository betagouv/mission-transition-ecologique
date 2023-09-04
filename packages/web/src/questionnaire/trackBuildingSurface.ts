export const buildingSurface = {
  id: 'track_structure_building_surface',
  category: 'building',
  title: { fr: 'Mes bâtiments (surface)' },
  label: { fr: "Quelle est la surface de vos locaux ?" },
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
      value: { structure_building_surface: '-1000m2' },
      title: { fr: '< 1 000 m2' },
      label: { fr: "🏠 Inférieur à 1 000m2" },
      next: {
        default: 'track_mobility'
      }
    },
    {
      value: { structure_building_surface: '+1000m2' },
      title: { fr: '> 1 000 m2' },
      label: { fr: "🏢 Supérieur à 1 000m2" },
      next: {
        default: 'track_mobility'
      }
    },
    {
      value: { structure_building_surface: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Je ne sais pas" },
      next: {
        default: 'track_mobility'
      }
    }
  ]
}