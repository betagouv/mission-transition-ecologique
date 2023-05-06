export const sizes = {
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  options: [
    {
      value: 'sizes.tpe',
      label: { fr: "TPE" },
      next: {
        default: 'results'
      }
    },
    {
      value: 'sizes.pme',
      label: { fr: "PME" },
      next: {
        default: 'contact_form'
      }
    },
    {
      value: 'sizes.eti',
      label: { fr: "ETI" },
      next: {
        default: 'results'
      }
    }
  ]
}