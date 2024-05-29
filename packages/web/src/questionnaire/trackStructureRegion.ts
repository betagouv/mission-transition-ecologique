// CONSOLE LOG TEMPLATE
// console.log(`questionnaire.trackStructureRegion > FUNCTION_NAME > MSG_OR_VALUE :`)

import { Region, Track, TrackOptionsUnion } from '@/types'
import { TrackComponent, TrackId, ConditionOperators, DataMappingFrom } from '@/types'
import { QuestionnaireRoute } from '@tee/common/src/questionnaire/types/types'
import type { NextTrackRuleSet } from '@/types'

const nextTrackRulesSet: NextTrackRuleSet[] = [
  {
    help: "Goes to track_structure_building_property if : questionnaire_route == 'no_specific_goal' (newbie)",
    rules: [
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
    help: "Goes to track_goals if : questionnaire_route == 'specific_goal' (pro)",
    rules: [
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

const regionsOptions: TrackOptionsUnion[] = Object.values(Region).map((regionName) => {
  return {
    value: regionName,
    questionnaireData: { region: regionName },
    title: { fr: regionName },
    label: { fr: regionName },
    next: {
      default: TrackId.Goals,
      ruleSet: nextTrackRulesSet
    }
  }
})

export const regions: Track = {
  id: TrackId.StructureRegion,
  category: 'myEntreprise',
  title: { fr: 'Ma localisation' },
  label: { fr: 'Où êtes-vous situé ?' },
  interface: {
    component: TrackComponent.Select
  },
  behavior: {
    multipleChoices: false
  },
  options: regionsOptions
}
