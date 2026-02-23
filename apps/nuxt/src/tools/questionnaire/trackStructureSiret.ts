// CONSOLE LOG TEMPLATE
// console.log(`questionnaire.trackSiret > FUNCTION_NAME > MSG_OR_VALUE :`)

import { HasInputOptions, SiretValue, TrackCategory, TrackComponent, TrackId } from '@/types'
import type { Track, NextTrackRuleSet, EstablishmentFront } from '@/types'
import { ConditionOperators, DataMappingFrom } from '@/types'
import { LegalCategory } from '@/types'

// legalCategory == '1000' means it's an individual compagny
const nextTrackRuleSets: NextTrackRuleSet[] = [
  {
    help: "Goes to track_structure_building_property if : legalCategory == '1000'",
    rules: [
      {
        from: DataMappingFrom.UsedTracks,
        id: 'legalCategory',
        dataField: 'legalCategory',
        conditions: [
          {
            type: 'legalCategory',
            operator: ConditionOperators.is,
            value: LegalCategory.EI
          }
        ]
      }
    ],
    next: { default: TrackId.BuildingProperty }
  }
]

const defaultQuestionnaireData: EstablishmentFront = {
  siret: '',
  codeNAF: '',
  codeNAF1: '',
  ville: '',
  legalCategory: '',
  codePostal: '',
  region: undefined,
  structure_size: undefined,
  denomination: '',
  secteur: '',
  creationDate: ''
}

export const siret: Track = {
  id: TrackId.Siret,
  category: TrackCategory.MyEntreprise,
  title: { fr: 'Mon SIRET' },
  label: { fr: 'Quelle est votre entreprise ?' },
  interface: {
    component: TrackComponent.Siret
  },
  next: {
    default: TrackId.StructureWorkforce,
    ruleSet: nextTrackRuleSets
  },
  options: [
    {
      id: 'search-siret',
      hasInput: HasInputOptions.Search,
      value: undefined,
      questionnaireData: { ...defaultQuestionnaireData },
      title: { fr: 'SIRET' },
      hintLabel: { fr: 'ex : "Fromagerie Sanzot Angers" ou N° SIRET "130 025 265 00013"' },
      next: {
        default: TrackId.StructureWorkforce,
        ruleSet: nextTrackRuleSets
      },
      wildcard: {
        label: { fr: 'je préfère compléter mes informations manuellement' },
        value: SiretValue.Wildcard,
        next: {
          default: TrackId.StructureWorkforce
        }
      }
    }
  ]
}
