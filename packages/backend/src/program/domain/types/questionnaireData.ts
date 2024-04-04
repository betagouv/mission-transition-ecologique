import { QuestionnaireRoute } from '@tee/common/src/questionnaire/types'

export interface QuestionnaireData {
  codeNaf?: string
  questionnaire_route?: QuestionnaireRoute

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
