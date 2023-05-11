export const results = {
  id: 'results',
  label: { fr: 'Résultats'},
  interface: {
    component: 'results',
  },
  behavior: {
    static: true,
  },
  options: [
    {
      value: 'results.summary',
      label: { fr: "Vos résultats" },
      fields: [

      ],
      next: {
        default: false
      }
    }
  ]
}