import type { NextTrackRuleSet, Track } from '@/types'
import {
  ConditionOperators,
  DataMappingFrom,
  HasInputOptions,
  TrackComponents,
  TrackId
} from '@/types'
import { Entreprise } from '@/types/publicodesObjects'

const nextExceptions: NextTrackRuleSet[] = [
  {
    help: "Goes to track_sectors if : doesn't have infos about sector",
    rules: [
      {
        from: DataMappingFrom.UsedTracks,
        id: 'siret',
        dataField: 'siret',
        conditions: [
          {
            type: 'siret',
            operator: ConditionOperators.missing
          }
        ]
      }
    ],
    next: { default: TrackId.Sectors }
  },
  {
    help: "Goes to track_structure_building_property if : has infos about codeNaf AND user_help == 'unknown' (newbie)",
    rules: [
      {
        from: DataMappingFrom.UsedTracks,
        id: 'codeNaf',
        dataField: 'codeNaf',
        conditions: [
          {
            type: 'codeNaf',
            operator: ConditionOperators.exists
          }
        ]
      },
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
    help: "Goes to track_goals if : have infos about sector AND user_help == 'precise' (pro)",
    rules: [
      {
        from: DataMappingFrom.UsedTracks,
        id: 'codeNaf',
        dataField: 'codeNaf',
        conditions: [
          {
            type: 'codeNaf',
            operator: ConditionOperators.exists
          }
        ]
      },
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

export const workforce: Track = {
  id: TrackId.StructureWorkforce,
  category: 'myEntreprise',
  title: { fr: 'Mes effectifs' },
  label: { fr: 'Combien êtes-vous dans votre entreprise ?' },
  interface: {
    component: TrackComponents.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      disabled: false,
      value: { [Entreprise.Workforce]: 19, structure_sizes: ['TPE'] },
      title: { fr: 'Moins de 20 employés' },
      label: { fr: '‍️🧍‍ Moins de 20 employés' },
      next: {
        default: TrackId.Sectors,
        exceptions: nextExceptions
      }
    },
    {
      disabled: false,
      value: { [Entreprise.Workforce]: 49, structure_sizes: ['PME'] },
      title: { fr: 'Entre 20 et 49 employés' },
      label: { fr: '‍️👫 Entre 20 et 49 employés' },
      next: {
        default: TrackId.Sectors,
        exceptions: nextExceptions
      }
    },
    {
      disabled: false,
      value: { [Entreprise.Workforce]: 249, structure_sizes: ['PME'] },
      title: { fr: 'Entre 50 et 250 employés' },
      label: { fr: '‍️👫👭 Entre 50 et 250 employés' },
      next: {
        default: TrackId.Sectors,
        exceptions: nextExceptions
      }
    },
    {
      disabled: false,
      value: { [Entreprise.Workforce]: 251, structure_sizes: ['ETI', 'GE'] },
      title: { fr: '+250 employés' },
      label: { fr: '👫👭👫 Plus de 250 employés' },
      next: {
        default: TrackId.Sectors,
        exceptions: nextExceptions
      }
    }
  ]
}
