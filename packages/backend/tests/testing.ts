import { ProgramData, ProgramAidType } from '@tee/web/src/types/programTypes'

/** makes data for a mock program with given eligibility rules */
export const makeProgram = (rules: Object): ProgramData => {
  return {
    id: '',
    titre: '',
    promesse: '',
    description: '',
    illustration: '',
    objectifs: [],
    'opérateur de contact': '',
    "nature de l'aide": ProgramAidType.acc,
    publicodes: rules
  }
}
