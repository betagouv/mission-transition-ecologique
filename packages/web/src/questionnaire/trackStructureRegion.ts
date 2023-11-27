import type { Track } from '@/types'
import {
  TrackComponents,
  TrackId,
  ConditionOperators,
  DataMappingFrom,
} from '@/types'
import type { NextTrackRuleSet } from '@/types'

const regionsList = [
  //France métropolitaine
  { label: 'Auvergne-Rhône-Alpes' },
  { label: 'Bourgogne-Franche-Comté' },
  { label: 'Bretagne' },
  { label: 'Centre-Val de Loire' },
  { label: 'Corse' },
  { label: 'Grand Est' },
  { label: 'Hauts-de-France' },
  { label: 'Normandie' },
  { label: 'Nouvelle-Aquitaine' },
  { label: 'Occitanie' },
  { label: "Provence-Alpes-Côte d'Azur" },
  { label: 'Pays de la Loire' },
  { label: 'Île-de-France' },

  //DOM
  { label: 'Guadeloupe' },
  { label: 'Guyane' },
  { label: 'La Réunion' },
  { label: 'Martinique' },
  { label: 'Mayotte' },

  //Collectivités d'outre-mer
  { label: 'Ile de Clipperton' },
  { label: 'Nouvelle-Calédonie' },
  { label: 'Polynésie française' },
  { label: 'Saint-Barthélemy' },
  { label: 'Saint-Martin' },
  { label: 'Saint-Pierre-Et-Miquelon' },
  { label: 'Terres australes et antarctiques françaises' },
  { label: 'Wallis et Futuna' }
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
    help: "Goes to track_goals if : user_help == 'preise' (pro)",
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

const regionsOptions = regionsList.map(reg => {
  return {
    value: { région: reg.label },
    title: { fr: reg.label },
    label: { fr: reg.label },
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
    component: TrackComponents.Select,
  },
  behavior: {
    multipleChoices: false,
  },
  options: regionsOptions
}
