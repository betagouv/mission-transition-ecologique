import type { NextTrackRuleSet, Track } from '@/types'
import { ConditionOperators, DataMappingFrom, TrackComponent, TrackId, StructureSize } from '@/types'
import { QuestionnaireRoute } from '@tee/common/src/questionnaire/types/types'

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
    help: "Goes to track_structure_building_property if : has infos about codeNaf AND questionnaire_route == 'no_specific_goal' (newbie)",
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
      },
      {
        from: DataMappingFrom.UsedTracks,
        id: 'questionnaire_route',
        dataField: 'questionnaire_route',
        conditions: [
          {
            type: 'questionnaire_route',
            operator: ConditionOperators.is,
            value: QuestionnaireRoute.NoSpecificGoal
          }
        ]
      }
    ],
    next: { default: TrackId.BuildingProperty }
  },
  {
    help: "Goes to track_goals if : have infos about sector AND questionnaire_route == 'specific_goal' (pro)",
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
      },
      {
        from: DataMappingFrom.UsedTracks,
        id: 'questionnaire_route',
        dataField: 'questionnaire_route',
        conditions: [
          {
            type: 'questionnaire_route',
            operator: ConditionOperators.is,
            value: QuestionnaireRoute.SpecificGoal
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
    component: TrackComponent.Buttons
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      value: StructureSize.EI,
      questionnaireData: { structure_size: StructureSize.EI },
      title: { fr: 'Entreprise individuelle' },
      label: { fr: '‍️🧍Je suis un entrepreneur individuel' },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    },
    {
      value: StructureSize.TPE,
      questionnaireData: { structure_size: StructureSize.TPE },
      title: { fr: 'Moins de 20 employés' },
      label: { fr: '‍️👫 Moins de 20 employés' },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    },
    {
      value: StructureSize.PE,
      questionnaireData: { structure_size: StructureSize.PE },
      title: { fr: 'Entre 20 et 49 employés' },
      label: { fr: '‍️👫👫 Entre 20 et 49 employés' },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    },
    {
      value: StructureSize.ME,
      questionnaireData: { structure_size: StructureSize.ME },
      title: { fr: 'Entre 50 et 250 employés' },
      label: { fr: '‍️👫👭👫 Entre 50 et 250 employés' },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    },
    {
      value: StructureSize.ETI_GE,
      questionnaireData: { structure_size: StructureSize.ETI_GE },
      title: { fr: 'Plus de 250 employés' },
      label: { fr: '👫👭👫👫 Plus de 250 employés' },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    }
  ]
}
