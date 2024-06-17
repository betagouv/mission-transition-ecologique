import { FILTERING_RULE_NAME } from '../../src/program/domain/filterPrograms'
import { ProgramType } from '@tee/data'
import { ProgramRepository } from '../../src/program/domain/spi'
import { ProgramAidType } from '@tee/common'

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
}): ProgramType => {
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

export const makeProgramsRepository = (programs: ProgramType[]): ProgramRepository => {
  return {
    getById: () => undefined,
    getAll: () => programs
  }
}
