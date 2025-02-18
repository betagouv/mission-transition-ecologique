import { NextTrackRuleSet, SizeToText, Track, TrackCategory } from '@/types'
import { ConditionOperators, DataMappingFrom, TrackComponent, TrackId, StructureSize } from '@/types'

const nextTrackRuleSets: NextTrackRuleSet[] = [
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
            operator: ConditionOperators.isMissing
          }
        ]
      }
    ],
    next: { default: TrackId.Sectors }
  },
  {
    help: 'Goes to track_structure_building_property if : has infos about codeNaf',
    rules: [
      {
        from: DataMappingFrom.UsedTracks,
        id: 'codeNAF',
        dataField: 'codeNAF',
        conditions: [
          {
            type: 'codeNAF',
            operator: ConditionOperators.exists
          }
        ]
      }
    ],
    next: { default: TrackId.BuildingProperty }
  }
]

export const workforce: Track = {
  id: TrackId.StructureWorkforce,
  category: TrackCategory.MyEntreprise,
  title: { fr: 'Mes effectifs' },
  label: { fr: 'Combien êtes-vous dans votre entreprise ?' },
  interface: {
    component: TrackComponent.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      value: StructureSize.EI,
      questionnaireData: { structure_size: StructureSize.EI },
      title: { fr: SizeToText[StructureSize.EI].title },
      label: { fr: SizeToText[StructureSize.EI].label },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    },
    {
      value: StructureSize.MICRO,
      questionnaireData: { structure_size: StructureSize.MICRO },
      title: { fr: SizeToText[StructureSize.MICRO].title },
      label: { fr: SizeToText[StructureSize.MICRO].label },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    },

    {
      value: StructureSize.TPE,
      questionnaireData: { structure_size: StructureSize.TPE },
      title: { fr: SizeToText[StructureSize.TPE].title },
      label: { fr: SizeToText[StructureSize.TPE].label },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    },
    {
      value: StructureSize.PE,
      questionnaireData: { structure_size: StructureSize.PE },
      title: { fr: SizeToText[StructureSize.PE].title },
      label: { fr: SizeToText[StructureSize.PE].label },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    },
    {
      value: StructureSize.ME,
      questionnaireData: { structure_size: StructureSize.ME },
      title: { fr: SizeToText[StructureSize.ME].title },
      label: { fr: SizeToText[StructureSize.ME].label },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    },
    {
      value: StructureSize.ETI,
      questionnaireData: { structure_size: StructureSize.ETI },
      title: { fr: SizeToText[StructureSize.ETI].title },
      label: { fr: SizeToText[StructureSize.ETI].label },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    },
    {
      value: StructureSize.GE,
      questionnaireData: { structure_size: StructureSize.GE },
      title: { fr: SizeToText[StructureSize.GE].title },
      label: { fr: SizeToText[StructureSize.GE].label },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    }
  ]
}
