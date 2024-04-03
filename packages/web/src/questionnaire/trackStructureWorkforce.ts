import type { NextTrackRuleSet, Track } from '@/types'
import { ConditionOperators, DataMappingFrom, TrackComponent, TrackId, Entreprise } from '@/types'
import { QuestionnaireRoute } from '@tee/common/src/questionnaire/types'

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

export enum Workforce {
  TPE = 'TPE',
  PME = 'PME',
  PE = 'PE',
  ME = 'ME',
  ETI = 'ETI',
  GE = 'GE',
  ETI_GE = 'ETI_et_GE'
}

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
      value: Workforce.TPE,
      questionnaireData: { [Entreprise.Workforce]: 19, structure_sizes: [Workforce.TPE] },
      title: { fr: 'Moins de 20 employés' },
      label: { fr: '‍️🧍‍ Moins de 20 employés' },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    },
    {
      value: Workforce.PE,
      questionnaireData: { [Entreprise.Workforce]: 49, structure_sizes: [Workforce.PME] },
      title: { fr: 'Entre 20 et 49 employés' },
      label: { fr: '‍️👫 Entre 20 et 49 employés' },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    },
    {
      value: Workforce.ME,
      questionnaireData: { [Entreprise.Workforce]: 249, structure_sizes: [Workforce.PME] },
      title: { fr: 'Entre 50 et 250 employés' },
      label: { fr: '‍️👫👭 Entre 50 et 250 employés' },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    },
    {
      value: Workforce.ETI_GE,
      questionnaireData: { [Entreprise.Workforce]: 251, structure_sizes: [Workforce.ETI, Workforce.GE] },
      title: { fr: '+250 employés' },
      label: { fr: '👫👭👫 Plus de 250 employés' },
      next: {
        default: TrackId.Sectors,
        ruleSet: nextTrackRuleSets
      }
    }
  ]
}
