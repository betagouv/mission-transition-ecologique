import { QuestionnaireRoute } from '@tee/common/src/questionnaire/types'

export { type Program } from '@tee/data/src/type/program'
export { type Operators } from '@tee/data/src/generated/program'

export interface QuestionnaireData {
  codeNaf?: string
  questionnaire_route?: QuestionnaireRoute
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface PublicodesInputData {
  [PublicodesKeys.NAFCode]?: string
  [PublicodesKeys.ValidityStart]?: string
  [PublicodesKeys.ValidityEnd]?: string
  [PublicodesKeys.CurrentDate]: string
  [PublicodesKeys.QuestionnaireRoute]?: PublicodesQuestionnaireRoute
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export enum PublicodesQuestionnaireRoute {
  NoSpecificGoal = '"je ne sais pas par où commencer"',
  SpecificGoal = '"objectif précis"'
}

export enum PublicodesKeys {
  NAFCode = 'entreprise . code NAF',
  ValidityStart = 'dispositif . début de validité',
  ValidityEnd = 'dispositif . fin de validité',
  QuestionnaireRoute = 'questionnaire . parcours',
  CurrentDate = 'date du jour'
}
