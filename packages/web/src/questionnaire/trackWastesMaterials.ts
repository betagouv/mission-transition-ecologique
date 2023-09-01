export const wastesMaterials = {
  id: 'track_wastes_materials',
  category: 'wastes',
  title: { fr: 'Déchets' },
  label: { fr: "Pensez-vous avoir un enjeu important sur les pertes de vos matières premières ?" },
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
      value: { wastes_materials : 'yes' },
      title: { fr: 'Oui' },
      label: { fr: "👍 Oui, je pense que c'est un enjeu important" },
      next: {
        default: 'track_water_stake'
      }
    },
    {
      value: { wastes_materials : 'no' },
      title: { fr: "Non" },
      label: { fr: "🗑 Non, pas vraiment" },
      next: {
        default: 'track_water_stake'
      }
    },
    {
      value: { wastes_materials: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Je ne sais pas ou je ne suis pas concerné" },
      next: {
        default: 'track_water_stake'
      }
    }
  ]
}