export const status = {
  id: 'track_status',
  label: { fr: 'Statut de votre projet' },
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: true,
    operator: 'or',
  },
  next: {
    default: 'track_sectors'
  },
  options: [
    {
      value: 'project_status.economies',
      label: { fr: 'Je veux faire des économies' },
    },
    {
      value: 'project_status.carbon',
      label: { fr: "J'ai besoin de connaître et réduire mes émissions carbone" },
    },
    {
      value: 'project_status.improve',
      label: { fr: "J'ai besoin d'améliorer mon produit/service" },
    }
  ]
}
