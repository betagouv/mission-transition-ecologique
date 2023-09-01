const nextExceptions = [
  {
    help: "Goes to track_structure_building_property if : user_help == 'unknown' (newbie)",
    rules: [
      { 
        from: 'usedTracks',
        id: 'user_help',
        dataField: 'user_help',
        conditions: [
          { 
            type: 'user_help',
            operator: '==',
            value: 'unknown',
          }
        ]
      }
    ],
    next: { default: 'track_structure_building_property' }
  },
  {
    help: "Goes to track_goals if : user_help == 'preise' (pro)",
    rules: [
      { 
        from: 'usedTracks',
        id: 'user_help',
        dataField: 'user_help',
        conditions: [
          { 
            type: 'user_help',
            operator: '==',
            value: 'precise',
          }
        ]
      }
    ],
    next: { default: 'track_goals' }
  }
]

export const sectors = {
  id: 'track_sectors',
  help: 'https://www.insee.fr/fr/metadonnees/nafr2',
  category: 'entreprise',
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
      title: { fr: 'Artisanat' },
      label: { fr: "J’ai une activité artisanale" },
      next: {
        default: 'track_roles',
        exceptions: nextExceptions
      }
    },
    {
      value: { project_sectors: 'industry' },
      title: { fr: 'Industrie' },
      label: { fr: "J’ai une activité industrielle, fabrication, production" },
      next: {
        default: 'track_roles',
        exceptions: nextExceptions
      }
    },
    {
      value: { project_sectors: 'tourism' },
      title: { fr: 'Tourisme' },
      label: { fr: "J’ai une activité de tourisme" },
      next: {
        default: 'track_roles',
        exceptions: nextExceptions
      }
    },
    {
      value: { project_sectors: 'tertiary' },
      title: { fr: 'Tertiaire' },
      label: { fr: "J’ai une activité tertiaire, de services" },
      next: {
        default: 'track_roles',
        exceptions: nextExceptions
      }
    },
    {
      value: { project_sectors: 'agriculture' },
      title: { fr: 'Agriculture' },
      label: { fr: "J’ai une activité agricole" },
      next: {
        default: 'track_roles',
        exceptions: nextExceptions
      }
    },
    {
      value: { project_sectors: '*' },
      title: { fr: 'Autre' },
      label: { fr: "Je suis dans un autre secteur d'activité" },
      next: {
        default: 'track_roles',
        exceptions: nextExceptions
      }
    }
  ]
}