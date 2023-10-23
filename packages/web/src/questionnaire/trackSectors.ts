import { secteurs, SecteurByNAF, NAF1ToVar, codesNAF1 } from './publicodesObjects'

// const secteurs = {
//   "entreprise . secteur d'activité . est artisanat": 'non',
//   "entreprise . secteur d'activité . est industrie": 'non',
//   "entreprise . secteur d'activité . est tourisme": 'non',
//   "entreprise . secteur d'activité . est tertiaire": 'non',
//   "entreprise . secteur d'activité . est agriculture": 'non',
//   "entreprise . secteur d'activité . est autre secteur": 'non'
// }

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
            value: 'unknown'
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
            value: 'precise'
          }
        ]
      }
    ],
    next: { default: 'track_goals' }
  }
]

// const test = { ...codesNAF1 }
// const test = SecteurByNAF['artisanat'].map((l) => { return { [NAF1ToVar(l)]: 'oui' } })
// const test = {
//   'test': 'yes',
//   ...Object.assign({}, ...SecteurByNAF['artisanat'].map((l) => { return { [NAF1ToVar(l)]: 'oui' }} ))
// }
// console.log(test)


export const sectors = {
  id: 'track_sectors',
  help: 'https://www.insee.fr/fr/metadonnees/nafr2',
  category: 'myEntreprise',
  title: { fr: 'Mon activité' },
  label: { fr: 'Quelle est votre activité ?' },
  interface: {
    component: 'buttons'
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      value: {
          secteur: 'Artisanat',
          ...secteurs, 
          "entreprise . secteur d'activité . est artisanat": 'oui',
          // "entreprise . code NAF niveau 1 . est A": 'oui'
          ...Object.assign({}, ...SecteurByNAF['artisanat'].map((l) => { return { [NAF1ToVar(l)]: 'oui' } }))
      },
      title: { fr: 'Artisanat' },
      label: { fr: '👩‍🎨 J’ai une activité artisanale' },
      next: {
        default: 'track_roles',
        exceptions: nextExceptions
      }
    },
    {
      value: {
          secteur: 'Industrie',
          ...secteurs, 
          "entreprise . secteur d'activité . est industrie": 'oui',
          ...codesNAF1,
          ...Object.assign({}, ...SecteurByNAF['industrie'].map((l) => { return { [NAF1ToVar(l)]: 'oui' } }))
      },
      title: { fr: 'Industrie' },
      label: { fr: '👩‍🔧 J’ai une activité industrielle, fabrication, production' },
      next: {
        default: 'track_roles',
        exceptions: nextExceptions
      }
    },
    {
      value: {
          secteur: 'Tourisme',
          ...secteurs, 
          "entreprise . secteur d'activité . est tourisme": 'oui',
          ...codesNAF1,
          ...Object.assign({}, ...SecteurByNAF['tourisme'].map((l) => { return { [NAF1ToVar(l)]: 'oui' } }))
      },
      title: { fr: 'Tourisme' },
      label: { fr: '🤵‍♂️ J’ai une activité de tourisme, restauration' },
      next: {
        default: 'track_roles',
        exceptions: nextExceptions
      }
    },
    {
      value: {
          secteur: 'Tertiaire',
          ...secteurs, 
          "entreprise . secteur d'activité . est tertiaire": 'oui',
          ...codesNAF1,
          ...Object.assign({}, ...SecteurByNAF['tertiaire'].map((l) => { return { [NAF1ToVar(l)]: 'oui' } }))
      },
      title: { fr: 'Tertiaire' },
      label: { fr: '🧑‍⚖️ J’ai une activité tertiaire, de services' },
      next: {
        default: 'track_roles',
        exceptions: nextExceptions
      }
    },
    {
      value: {
          secteur: 'Agriculture',
          ...secteurs, 
          "entreprise . secteur d'activité . est agriculture": 'oui',
          ...codesNAF1,
          ...Object.assign({}, ...SecteurByNAF['agriculture'].map((l) => { return { [NAF1ToVar(l)]: 'oui' } }))
      },
      title: { fr: 'Agriculture' },
      label: { fr: '👩‍🌾 J’ai une activité agricole' },
      next: {
        default: 'track_roles',
        exceptions: nextExceptions
      }
    },
    {
      value: {
          secteur: 'Autre',
          ...secteurs, 
          "entreprise . secteur d'activité . est autre secteur": 'oui',
          ...codesNAF1,
          ...Object.assign({}, ...SecteurByNAF['autre secteur'].map((l) => { return { [NAF1ToVar(l)]: 'oui' } }))
      },
      title: { fr: 'Autre' },
      label: { fr: "Je suis dans un autre secteur d'activité" },
      next: {
        default: 'track_roles',
        exceptions: nextExceptions
      }
    }
  ]
}

// console.log(sectors)