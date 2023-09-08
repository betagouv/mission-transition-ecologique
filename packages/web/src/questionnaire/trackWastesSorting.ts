export const wastesSorting = {
  id: 'track_wastes_sorting',
  category: 'myWastes',
  title: { fr: 'Tri des déchets' },
  label: { fr: "Avez-vous mis en place une solution de tri des déchets dans votre entreprise ?" },
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
      value: { wastes_sorting : 'yes' },
      title: { fr: 'Oui' },
      label: { fr: "✅ Oui, j’ai déjà mis en place un système de tri" },
      next: {
        default: 'track_wastes_materials'
      }
    },
    {
      value: { wastes_sorting : 'no' },
      title: { fr: "Non" },
      label: { fr: "🗑 Non, je peux faire mieux !" },
      next: {
        default: 'track_wastes_materials'
      }
    },
    {
      value: { wastes_sorting: 'unknown' },
      title: { fr: 'Je ne sais pas' },
      label: { fr: "Je ne sais pas" },
      next: {
        default: 'track_wastes_materials'
      }
    }
  ]
}