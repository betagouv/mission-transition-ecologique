import { QuestionnaireRoute } from '../../../../common/src/questionnaire/types'

export { type Program } from '@tee/data/src/type/program'
export { type Operators } from '@tee/data/src/generated/program'

export interface QuestionnaireData {
  codeNaf?: string
  questionnaire_route?: QuestionnaireRoute
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
