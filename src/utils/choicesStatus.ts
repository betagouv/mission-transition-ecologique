export const status = {
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  options: [
    {
      value: 'status.economies',
      label: { fr: 'je veux faire des économies' },
      next: {
        default: 'sectors'
      }
    },
    {
      value: 'status.carbon',
      label: { fr: "j'ai besoin de connaître et réduire ses émissions carbone" },
      next: {
        default: 'sectors'
      }
    },
    {
      value: 'status.improve',
      label: { fr: "j'ai besoin d'améliorer mon produit/service" },
      next: {
        default: 'sectors'
      }
    }
  ]
}