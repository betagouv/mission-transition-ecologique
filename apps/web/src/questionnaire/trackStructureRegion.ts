// CONSOLE LOG TEMPLATE
// console.log(`questionnaire.trackStructureRegion > FUNCTION_NAME > MSG_OR_VALUE :`)

import { Track, TrackCategory, HasInputOptions } from '@/types'
import { TrackComponent, TrackId, ConditionOperators, DataMappingFrom } from '@/types'
import { QuestionnaireRoute } from '@tee/common'
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

export const regions: Track = {
  id: TrackId.StructureCity,
  category: TrackCategory.MyEntreprise,
  title: { fr: 'Ma localisation' },
  label: { fr: 'Quelle est votre ville ?' },
  interface: {
    component: TrackComponent.CitySearch
  },
  behavior: {
    multipleChoices: false
  },
  options: [
    {
      id: 'search-city',
      hint: { fr: 'Recherchez par code postal ou nom de ville' },
      hasInput: HasInputOptions.Search,
      value: undefined,
      questionnaireData: { ville: '', region: '', codePostal: '' },
      title: { fr: 'LOCALISATION' },
      next: {
        default: TrackId.StructureWorkforce,
        ruleSet: nextTrackRulesSet
      }
    }
  ]
}
