import { QuestionnaireRoute } from '@tee/common/src/questionnaire/types'

export enum QuestionnaireDataEnum {
  codeNaf = 'codeNaf',
  questionnaire_route = 'questionnaire_route'
}

export interface QuestionnaireData {
  codeNaf?: string
  [QuestionnaireDataEnum.questionnaire_route]?: QuestionnaireRoute

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
