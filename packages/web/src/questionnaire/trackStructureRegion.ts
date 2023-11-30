import type { Track } from '@/types'
import { TrackComponents, TrackId, ConditionOperators, DataMappingFrom } from '@/types'
import type { NextTrackRuleSet } from '@/types'

// note : based on authorized values in "/packages/data/common/interface.yaml"
const regionsList = [
  //France métropolitaine
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  "Provence-Alpes-Côte d'Azur",
  'Pays de la Loire',
  'Île-de-France',

  //DOM
  'Guadeloupe',
  'Guyane',
  'La Réunion',
  'Martinique',
  'Mayotte',

  //Collectivités d'outre-mer
  'Ile de Clipperton',
  'Nouvelle-Calédonie',
  'Polynésie française',
  'Saint-Barthélemy',
  'Saint-Martin',
  'Saint-Pierre-Et-Miquelon',
  'Terres australes et antarctiques françaises',
  'Wallis et Futuna'
]

const nextExceptions: NextTrackRuleSet[] = [
  {
    help: "Goes to track_structure_building_property if : user_help == 'unknown' (newbie)",
    rules: [
      {
        from: DataMappingFrom.UsedTracks,
        id: 'user_help',
        dataField: 'user_help',
        conditions: [
          {
            type: 'user_help',
            operator: ConditionOperators.is,
            value: 'unknown'
          }
        ]
      }
    ],
    next: { default: TrackId.BuildingProperty }
  },
  {
    help: "Goes to track_goals if : user_help == 'precise' (pro)",
    rules: [
      {
        from: DataMappingFrom.UsedTracks,
        id: 'user_help',
        dataField: 'user_help',
        conditions: [
          {
            type: 'user_help',
            operator: ConditionOperators.is,
            value: 'precise'
          }
        ]
      }
    ],
    next: { default: TrackId.Goals }
  }
]

const regionsOptions = regionsList.map((regName) => {
  return {
    value: { région: regName },
    title: { fr: regName },
    label: { fr: regName },
    next: {
      default: TrackId.Goals,
      exceptions: nextExceptions
    }
  }
})
// console.log('questionnaire > trackStructureRegions > regionsOptions :', regionsOptions)

export const regions: Track = {
  id: TrackId.StructureRegion,
  category: 'myEntreprise',
  title: { fr: 'Ma localisation' },
  label: { fr: 'Où êtes-vous situé ?' },
  interface: {
    component: TrackComponents.Select
  },
  behavior: {
    multipleChoices: false
  },
  options: regionsOptions
}
