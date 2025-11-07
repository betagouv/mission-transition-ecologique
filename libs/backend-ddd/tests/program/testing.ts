import { ProgramType, ProgramAidType } from '@tee/data'
import { ProgramEligibilityEvaluator } from '../../src/program/domain/programEligibilityEvaluator'
import ProgramFeatures from '../../src/program/domain/programFeatures'
import { ProgramRepository } from '../../src/program/domain/spi'

export type Rules = { ['entreprise . est ciblée']: { [k: string]: unknown } | string; [k: string]: unknown }

/** makes data for a mock program with given eligibility rules */
export const makeProgramHelper = ({
  id = '',
  rules = { ['entreprise . est ciblée']: { valeur: 'oui' } },
  cost = '1000 €',
  nature = ProgramAidType.study
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
    publicodes: rules,
    eligibilityData: { company: { allowedNafSections: ['I'] } }
  }
}

export const mockCurrentDateService = { get: () => '01/01/2024' }

export const makeProgramsRepository = (programs: ProgramType[]): ProgramRepository => {
  return {
    getById: (id: string) => programs.find((p) => p.id === id),
    getAll: () => programs,
    getEditablePrograms: () => programs
  }
}

export const makeProgramFeatures = (programs: ProgramType[]): ProgramFeatures => {
  return new ProgramFeatures(makeProgramsRepository(programs), new ProgramEligibilityEvaluator())
}
