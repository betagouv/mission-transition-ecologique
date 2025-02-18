import { Color, ConditionOperators, DataMappingFrom, NextTrackRule, type NextTrackRuleSet, Track, TrackCategory } from '@/types'
import { TrackComponent, TrackId } from '@/types'
import { CompanyDataStorageKey } from '@/tools/companyData/types/companyDataType'

const commonRules: NextTrackRuleSet[] = [
  {
    help: 'Goes to track_structure_building_property if : siret exists',
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
    help: 'Goes to track_structure_building_property if : siret exists AND structure_size exists',
    rules: [...commonRules[1].rules, structureSizeRules[0]],
    next: { default: TrackId.BuildingProperty }
  },
  {
    ...commonRules[0],
    help: 'Goes to structure work force if : siret exists AND structure_size does not exist',
    rules: [...commonRules[0].rules, structureSizeRules[0]],
    next: { default: TrackId.StructureWorkforce }
  }
]

export const questionnaireRoute: Track = {
  id: TrackId.Questionnaire,
  category: TrackCategory.OurHelp,
  title: { fr: 'Par où commencer ?' },
  callout: {
    bgColor: Color.yellow,
    title: { fr: 'En avant !' },
    bigTitle: false,
    imageLeft: '/images/TEE-onboarding.png',
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
    default: TrackId.Siret,
    ruleSet: nextTrackRuleSets
  }
}
