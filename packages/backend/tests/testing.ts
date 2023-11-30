import { ProgramData, ProgramAidType } from '@tee/web/src/types/programTypes'

import { FILTERING_RULE_NAME } from '../src/domain/filter-programs'

/** makes data for a mock program with given eligibility rules */
export const makeProgramHelper = ({
  id = '',
  rules = { [FILTERING_RULE_NAME]: 'oui' },
  cost = '1000 €'
}: {
  id?: string
  rules?: Object
  cost?: string
}): ProgramData => {
  return {
    id: id,
    titre: '',
    promesse: '',
    description: '',
    illustration: '',
    objectifs: [],
    'opérateur de contact': '',
    "nature de l'aide": ProgramAidType.acc,
    "coût de l'accompagnement": cost,
    publicodes: rules
  }
}
