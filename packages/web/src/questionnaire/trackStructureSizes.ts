export const sizes = {
  id: 'track_structure_sizes',
  title: { fr: 'Mon entreprise' },
  label: { fr: 'Quelle est la taille de votre entreprise ?' },
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  options: [
    {
      value: { structure_sizes: 'tpe' },
      title: { fr: 'TPE' },
      label: { fr: "TPE (moins de 20 salariés)" },
      next: {
        default: 'track_sectors'
      }
    },
    {
      value: { structure_sizes: 'pme' },
      title: { fr: 'PME' },
      label: { fr: "PME (entre 20 et 249 salariés)" },
      next: {
        default: 'track_sectors'
      }
    },
    {
      disabled: true,
      value: { structure_sizes: 'eti' },
      title: { fr: 'ETI' },
      label: { fr: "ETI" },
      next: {
        default: 'track_sectors'
      }
    }
  ]
}