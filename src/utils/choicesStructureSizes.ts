export const sizes = {
  id: 'track_structure_sizes',
  label: { fr: 'Taille de votre structure' },
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
      value: 'structure_sizes.tpe',
      label: { fr: "TPE" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: 'structure_sizes.pme',
      label: { fr: "PME" },
      next: {
        default: 'track_results'
      }
    },
    {
      value: 'structure_sizes.eti',
      label: { fr: "ETI" },
      next: {
        default: 'track_results'
      }
    }
  ]
}