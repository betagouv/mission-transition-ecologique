export const status = {
  interface: {
    component: 'radioChoices',
  },
  choices: [
    {
      value: 'status.economies',
      label: { fr: 'je veux faire des économies' },
      next: {
        default: 'needs'
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
        default: 'needs'
      }
    }
  ]
}