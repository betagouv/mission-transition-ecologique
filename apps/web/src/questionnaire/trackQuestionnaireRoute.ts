import { Color, ConditionOperators, DataMappingFrom, NextTrackRule, type NextTrackRuleSet, Track, TrackCategory } from '@/types'
import { TrackComponent, TrackId } from '@/types'
import { QuestionnaireRoute } from '@tee/common'
import { CompanyDataStorageKey } from '@/utils/companyData/types/companyDataType'

const commonRules: NextTrackRuleSet[] = [
  {
    help: "Goes to track_goals if : siret exists AND questionnaire_route == 'specific_goal' (pro)",
    rules: [
      {
        from: DataMappingFrom.CompanyData,
        id: CompanyDataStorageKey.Company,
        dataField: CompanyDataStorageKey.Company,
        conditions: [
          {
            type: CompanyDataStorageKey.Company,
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
  },
  {
    help: "Goes to track_structure_building_property if : siret exists AND questionnaire_route == 'no_specific_goal' (newbie)",
    rules: [
      {
        from: DataMappingFrom.CompanyData,
        id: CompanyDataStorageKey.Company,
        dataField: CompanyDataStorageKey.Company,
        conditions: [
          {
            type: CompanyDataStorageKey.Company,
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
  }
]

const structureSizeRules: NextTrackRule[] = [
  {
    from: DataMappingFrom.CompanyData,
    id: CompanyDataStorageKey.Size,
    dataField: CompanyDataStorageKey.Size,
    conditions: [
      {
        type: CompanyDataStorageKey.Size,
        operator: ConditionOperators.exists
      }
    ]
  },
  {
    from: DataMappingFrom.CompanyData,
    id: CompanyDataStorageKey.Size,
    dataField: CompanyDataStorageKey.Size,
    conditions: [
      {
        type: CompanyDataStorageKey.Size,
        operator: ConditionOperators.isMissing
      }
    ]
  }
]

const nextTrackRuleSets: NextTrackRuleSet[] = [
  {
    ...commonRules[0],
    help: "Goes to track_goals if : siret exists AND structure_size exists AND questionnaire_route == 'specific_goal' (pro)",
    rules: [...commonRules[0].rules, structureSizeRules[0]]
  },
  {
    ...commonRules[0],
    help: "Goes to structure work force if : siret exists AND structure_size does not exist AND questionnaire_route == 'specific_goal' (pro)",
    rules: [...commonRules[0].rules, structureSizeRules[1]],
    next: { default: TrackId.StructureWorkforce }
  },
  {
    ...commonRules[1],
    help: "Goes to track_structure_building_property if : siret exists AND structure_size exists AND questionnaire_route == 'no_specific_goal' (newbie)",
    rules: [...commonRules[1].rules, structureSizeRules[0]]
  },
  {
    ...commonRules[1],
    help: "Goes to track_structure_building_property if : siret exists AND structure_size does not exist AND questionnaire_route == 'no_specific_goal' (newbie)",
    rules: [...commonRules[1].rules, structureSizeRules[1]],
    next: { default: TrackId.StructureWorkforce }
  }
]

export const questionnaireRoute: Track = {
  id: TrackId.QuestionnaireRoute,
  category: TrackCategory.OurHelp,
  title: { fr: 'Par où commencer ?' },
  label: { fr: 'Comment pouvons-nous vous aider ?' },
  callout: {
    bgColor: Color.yellow,
    title: { fr: 'En avant !' },
    bigTitle: false,
    imageLeft: 'images/TEE-onboarding.png',
    description: {
      fr: 'Nous allons vous poser quelques questions pour pouvoir identifier les accompagnements et les financements dont vous pouvez bénéficier.'
    },
    hintIcon: 'fr-icon-timer-line'
  },
  interface: {
    component: TrackComponent.Cards,
    columnWidth: 6
  },
  behavior: {
    multipleChoices: false
  },
  next: {
    default: TrackId.Results,
    ruleSet: nextTrackRuleSets
  },
  options: [
    {
      value: QuestionnaireRoute.NoSpecificGoal,
      questionnaireData: { questionnaire_route: QuestionnaireRoute.NoSpecificGoal },
      title: { fr: 'Je ne sais pas' },
      label: { fr: 'Je ne sais pas par où commencer' },
      resume: {
        fr: 'Faisons un état des lieux à 360° sur votre empreinte carbone : énergie, eau, déchets, mobilité...'
      },
      hintImage: { fr: '5 min. chrono !' },
      hintImageIcon: 'fr-icon-timer-line',
      imageTop: 'images/tracks/je-ne-sais-pas-par-ou-commencer.svg',
      next: {
        default: TrackId.Siret,
        ruleSet: nextTrackRuleSets
      }
    },
    {
      value: QuestionnaireRoute.SpecificGoal,
      questionnaireData: {
        questionnaire_route: QuestionnaireRoute.SpecificGoal
      },
      title: { fr: "J'ai un projet" },
      label: { fr: "J'ai un projet en tête !" },
      resume: {
        fr: 'Trouvons les accompagnements et financements qui peuvent vous aider à réaliser votre projet'
      },
      hintImage: { fr: '2 min. chrono !' },
      hintImageIcon: 'fr-icon-timer-line',
      imageTop: 'images/tracks/j-ai-un-obectif.svg',
      next: {
        default: TrackId.Siret,
        ruleSet: nextTrackRuleSets
      }
    }
  ]
}
