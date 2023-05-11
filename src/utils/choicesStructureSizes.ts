export const sizes = {
  id: 'structure_sizes',
  label: { fr: 'Taille de votre structure' },
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  options: [
    {
      value: 'structure_sizes.tpe',
      label: { fr: "TPE" },
      next: {
        default: 'results'
      }
    },
    {
      value: 'structure_sizes.pme',
      label: { fr: "PME" },
      next: {
        default: 'contact_form'
      }
    },
    {
      value: 'structure_sizes.eti',
      label: { fr: "ETI" },
      next: {
        default: 'results'
      }
    }
  ]
}