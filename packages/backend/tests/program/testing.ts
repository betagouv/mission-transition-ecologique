import { ProgramAidType } from '@tee/web/src/types/programTypes'

import { FILTERING_RULE_NAME } from '../../src/program/domain/filterPrograms'
import { Program } from '@tee/data/src/type/program'
import { ProgramRepository } from '../../src/program/domain/spi'

export type Rules = { [FILTERING_RULE_NAME]: { [k: string]: unknown } | string; [k: string]: unknown }

/** makes data for a mock program with given eligibility rules */
export const makeProgramHelper = ({
  id = '',
  rules = { [FILTERING_RULE_NAME]: { valeur: 'oui' } },
  cost = '1000 €',
  nature = ProgramAidType.acc
}: {
  id?: string
  rules?: Rules
  cost?: string
  nature?: ProgramAidType
}): Program => {
  return {
    id: id,
    titre: '',
    promesse: '',
    description: '',
    illustration: '',
    objectifs: [],
    'opérateur de contact': 'ADEME',
    "nature de l'aide": nature,
    "coût de l'accompagnement": cost,
    "conditions d'éligibilité": {
      "taille de l'entreprise": ['a', 'b'],
      'secteur géographique': ['c'],
      "secteur d'activité": ['d'],
      "nombre d'années d'activité": ['e']
    },
    publicodes: rules
  }
}

export const mockCurrentDateService = { get: () => '01/01/2024' }

export const makeProgramsRepository = (programs: Program[]): ProgramRepository => {
  return {
    getById: (_id: string) => undefined,
    getAll: () => programs
  }
}
