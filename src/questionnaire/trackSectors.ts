export const sectors = {
  id: 'track_sectors',
  title: { fr: 'Mon activité' },
  label: { fr: "Quel est votre activité ?" },
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  options: [
    {
      value: { project_sectors: 'craft' },
      label: { fr: "J’ai une activité artisanale" },
      next: {
        default: 'track_roles'
      }
    },
    {
      value: { project_sectors: 'industry' },
      label: { fr: "J’ai une activité industrielle, fabrication, production" },
      next: {
        default: 'track_roles'
      }
    },
    {
      value: { project_sectors: 'tourism' },
      label: { fr: "J’ai une activité de tourisme" },
      next: {
        default: 'track_roles'
      }
    },
    {
      value: { project_sectors: 'tertiary' },
      label: { fr: "J’ai une activité tertiaire, de services" },
      next: {
        default: 'track_roles'
      }
    },
    {
      value: { project_sectors: 'agriculture' },
      label: { fr: "J’ai une activité agricole" },
      next: {
        default: 'track_roles'
      }
    },
    {
      value: { project_sectors: '*' },
      label: { fr: "Je suis dans un autre secteur d'activité" },
      next: {
        default: 'track_roles'
      }
    }
  ]
}