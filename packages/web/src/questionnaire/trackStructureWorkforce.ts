const nextExceptions = [
  {
    help: "Goes to track_sectors if : doesn't have infos about sector",
    rules: [
      { 
        from: 'usedTracks',
        id: 'siret',
        dataField: 'siret',
        conditions: [
          { 
            type: 'siret',
            operator: 'inexists'
          }
        ]
      },
    ],
    next: { default: 'track_sectors'}
  },
  {
    help: "Goes to track_structure_building_property if : has infos about sector AND user_help == 'unknown' (newbie)",
    rules: [
      { 
        from: 'usedTracks',
        id: 'project_sectors',
        dataField: 'project_sectors',
        conditions: [
          { 
            type: 'project_sectors',
            operator: 'exists'
          }
        ]
      },
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
    help: "Goes to track_goals if : have infos about sector AND user_help == 'precise' (pro)",
    rules: [
      { 
        from: 'usedTracks',
        id: 'project_sectors',
        dataField: 'project_sectors',
        conditions: [
          { 
            type: 'project_sectors',
            operator: 'exists'
          }
        ]
      },
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

export const workforce = {
  id: 'track_structure_workforce',
  category: 'entreprise',
  title: { fr: 'Mes effectifs' },
  label: { fr: 'Combien êtes-vous dans votre entreprise ?' },
  interface: {
    component: 'buttons',
  },
  behavior: {
    multipleChoices: false,
  },
  options: [
    {
      value: { structure_workforce: 'TPE' },
      title: { fr: 'TPE ou PME' },
      label: { fr: "🧍‍♂employé.s" },
      hasInput: 'number',
      defaultInput: 1,
      inputField: 'structure_workforce',
      next: {
        default: 'track_sectors',
      }
    },
    {
      value: { structure_workforce: 'machin' },
      title: { fr: 'Type de machin' },
      label: { fr: "Un machin de type..." },
      hasInput: 'text',
      // defaultInput: 1,
      inputField: 'structure_workforce',
      next: {
        default: 'track_sectors',
      }
    },
    {
      disabled: false,
      value: { structure_workforce: '+200' },
      title: { fr: '+200 employés' },
      label: { fr: "‍️👫👭 Plus de 200 employés" },
      next: {
        default: 'track_sectors',
        exceptions: nextExceptions
      }
    }
  ]
}