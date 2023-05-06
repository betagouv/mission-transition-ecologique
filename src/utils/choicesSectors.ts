export const sectors = {
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  options: [
    {
      value: 'sectors.artisanat',
      label: { fr: "J’ai une activité artisanale" },
      next: {
        default: 'contact_form'
      }
    },
    {
      value: 'sectors.industriel',
      label: { fr: "J’ai une activité industrielle, fabrication, production" },
      next: {
        default: 'sizes'
      }
    },
    {
      value: 'sectors.tourisme',
      label: { fr: "j’ai une activité de tourisme" },
      next: {
        default: 'sizes'
      }
    },
    {
      value: 'sectors.tertiaire',
      label: { fr: "j’ai une activité tertiaire, de services" },
      next: {
        default: 'sizes'
      }
    },
    {
      value: 'sectors.agricole',
      label: { fr: "J’ai une activité agricole" },
      next: {
        default: 'sizes'
      }
    }
  ]
}