export const sectors = {
  id: 'track_sectors',
  label: { fr: "Secteur d'activité" },
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  options: [
    {
      value: 'project_sectors.artisanat',
      label: { fr: "J’ai une activité artisanale" },
      next: {
        default: 'track_form'
      }
    },
    {
      value: 'project_sectors.industriel',
      label: { fr: "J’ai une activité industrielle, fabrication, production" },
      next: {
        default: 'track_structure_sizes'
      }
    },
    {
      value: 'project_sectors.tourisme',
      label: { fr: "j’ai une activité de tourisme" },
      next: {
        default: 'track_structure_sizes'
      }
    },
    {
      value: 'project_sectors.tertiaire',
      label: { fr: "j’ai une activité tertiaire, de services" },
      next: {
        default: 'track_structure_sizes'
      }
    },
    {
      value: 'project_sectors.agricole',
      label: { fr: "J’ai une activité agricole" },
      next: {
        default: 'track_structure_sizes'
      }
    }
  ]
}