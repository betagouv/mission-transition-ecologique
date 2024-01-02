import type { ProgramData } from '@tee/web/src/types/programTypes'
import { ProgramAidType } from '@tee/web/src/types/programTypes'

import { FILTERING_RULE_NAME } from '../src/domain/program/filter-programs'

/** makes data for a mock program with given eligibility rules */
export const makeProgramHelper = ({
  id = '',
  rules = { [FILTERING_RULE_NAME]: 'oui' },
  cost = '1000 €',
  nature = ProgramAidType.acc
}: {
  id?: string
  rules?: object
  cost?: string
  nature?: ProgramAidType
}): ProgramData => {
  return {
    id: id,
    titre: '',
    promesse: '',
    description: '',
    illustration: '',
    objectifs: [],
    'opérateur de contact': '',
    "nature de l'aide": nature,
    "coût de l'accompagnement": cost,
    "conditions d'éligibilité": {
      "taille de l'entreprise": [],
      'secteur géographique': [],
      "secteur d'activité": [],
      "nombre d'années d'activité": []
    },
    publicodes: rules
  }
}
