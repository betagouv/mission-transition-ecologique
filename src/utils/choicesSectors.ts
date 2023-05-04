export const sectors = {
  interface: {
    component: 'radioChoices',
  },
  choices: [
    {
      value: 'sectors.artisanat',
      label: { fr: "J’ai une activité artisanale" },
      next: {
        default: 'results'
      }
    },
    {
      value: 'sectors.industriel',
      label: { fr: "J’ai une activité industrielle, fabrication, production" },
      next: {
        default: 'results'
      }
    },
    {
      value: 'sectors.tourisme',
      label: { fr: "j’ai une activité de tourisme" },
      next: {
        default: 'results'
      }
    },
    {
      value: 'sectors.tertiaire',
      label: { fr: "j’ai une activité tertiaire, de services" },
      next: {
        default: 'results'
      }
    },
    {
      value: 'sectors.agricole',
      label: "J’ai une activité agricole",
      next: {
        default: 'results'
      }
    }
  ]
}