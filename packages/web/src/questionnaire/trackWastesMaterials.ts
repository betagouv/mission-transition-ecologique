export const wastesMaterials = {
  id: 'track_wastes_materials',
  category: 'myWastes',
  title: { fr: 'Matières premières' },
  label: { fr: "Avez-vous pour objectif de réduire vos pertes de matières premières ou votre production de déchets ?" },
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
      label: { fr: "👍 Oui, nous aimerions limiter nos pertes de matières premières" },
      next: {
        default: 'track_water_stake'
      }
    },
    {
      value: { wastes_materials : 'no' },
      title: { fr: "Non" },
      label: { fr: "❌ Non, pas vraiment" },
      next: {
        default: 'track_water_stake'
      }
    },
    {
      value: { wastes_materials: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Je ne sais pas / Je ne suis pas concerné" },
      next: {
        default: 'track_water_stake'
      }
    }
  ]
}