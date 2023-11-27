import type { Track } from '@/types'
import {
  TrackComponents,
  TrackId,
  ConditionOperators,
  DataMappingFrom,
} from '@/types'
import type { NextTrackRuleSet } from '@/types'

// source : https://public.opendatasoft.com/explore/dataset/anciennes-nouvelles-regions/table/
import regionsJson from '@tee/web/public/data/references/anciennes-nouvelles-regions.json'

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

const map = new Map(regionsJson.map(pos => [pos.new_code, pos]))
const uniques = [...map.values()]
  .sort((a,b) => (a.new_name > b.new_name) ? 1 : -1)
const regionsOptions = uniques.map(reg => {
  return {
    value: reg,
    title: { fr: reg.new_name },
    label: { fr: reg.new_name },
    next: {
      default: TrackId.Goals,
      exceptions: nextExceptions
    }
  }
})
console.log('questionnaire > trackStructureRegions > regionsOptions :', regionsOptions)

export const regions: Track = {
  id: TrackId.StructureRegion,
  category: 'myEntreprise',
  title: { fr: 'Mon entreprise' },
  label: { fr: 'Où êtes-vous situé ?' },
  interface: {
    component: TrackComponents.Select,
  },
  behavior: {
    multipleChoices: false,
  },
  options: regionsOptions
}
