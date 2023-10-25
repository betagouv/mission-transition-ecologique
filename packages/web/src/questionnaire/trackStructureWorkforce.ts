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
      }
    ],
    next: { default: 'track_sectors' }
  },
  {
    help: "Goes to track_structure_building_property if : has infos about codeNaf AND user_help == 'unknown' (newbie)",
    rules: [
      {
        from: 'usedTracks',
        id: 'codeNaf',
        dataField: 'codeNaf',
        conditions: [
          {
            type: 'codeNaf',
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
            value: 'unknown'
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
        id: 'codeNaf',
        dataField: 'codeNaf',
        conditions: [
          {
            type: 'codeNaf',
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
            value: 'precise'
          }
        ]
      }
    ],
    next: { default: 'track_goals' }
  }
]

export const workforce = {
  id: 'track_structure_workforce',
  category: 'myEntreprise',
  title: { fr: 'Mes effectifs' },
  label: { fr: 'Combien êtes-vous dans votre entreprise ?' },
  interface: {
    component: 'buttons'
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      disabled: true,
      value: { 'entreprise . effectif': 0, structure_sizes: ['PME', 'TPE'] },
      title: { fr: 'TPE ou PME' },
      label: { fr: '🧍‍♂employé.s' },
      hasInput: 'number',
      defaultInput: 1,
      inputMax: 249,
      inputMin: 1,
      inputField: 'entreprise . effectif',
      inputCleaning: [
        {
          operator: '<',
          conditionValue: 20,
          valueField: 'structure_sizes',
          value: ['PME']
        },
        {
          operator: '>',
          conditionValue: 20,
          valueField: 'structure_sizes',
          value: ['TPE']
        }
      ],
      next: {
        default: 'track_sectors',
        exceptions: nextExceptions
      }
    },
    {
      disabled: false,
      value: { 'entreprise . effectif': 19, structure_sizes: ['TPE'] },
      title: { fr: 'Moins de 20 employés' },
      label: { fr: '‍️🧍‍ Moins de 20 employés' },
      next: {
        default: 'track_sectors',
        exceptions: nextExceptions
      }
    },
    {
      disabled: false,
      value: { 'entreprise . effectif': 49, structure_sizes: ['PME'] },
      title: { fr: 'Entre 20 et 49 employés' },
      label: { fr: '‍️👫 Entre 20 et 49 employés' },
      next: {
        default: 'track_sectors',
        exceptions: nextExceptions
      }
    },
    {
      disabled: false,
      value: { 'entreprise . effectif': 249, structure_sizes: ['PME'] },
      title: { fr: 'Entre 50 et 250 employés' },
      label: { fr: '‍️👫👭 Entre 50 et 250 employés' },
      next: {
        default: 'track_sectors',
        exceptions: nextExceptions
      }
    },
    {
      disabled: false,
      value: { 'entreprise . effectif': 251, structure_sizes: ['ETI', 'GE'] },
      title: { fr: '+250 employés' },
      label: { fr: '👫👭👫 Plus de 250 employés' },
      next: {
        default: 'track_sectors',
        exceptions: nextExceptions
      }
    }
  ]
}
