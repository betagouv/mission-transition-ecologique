export const status = {
  id: 'project_status',
  label: { fr: 'Statut de votre projet' },
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: true,
  },
  next: {
    default: 'project_sectors'
  },
  options: [
    {
      value: 'project_status.economies',
      label: { fr: 'Je veux faire des économies' },
      // next: {
      //   default: 'sectors'
      // }
    },
    {
      value: 'project_status.carbon',
      label: { fr: "J'ai besoin de connaître et réduire mes émissions carbone" },
      // next: {
      //   default: 'sectors'
      // }
    },
    {
      value: 'project_status.improve',
      label: { fr: "J'ai besoin d'améliorer mon produit/service" },
      // next: {
      //   default: 'sectors'
      // }
    }
  ]
}