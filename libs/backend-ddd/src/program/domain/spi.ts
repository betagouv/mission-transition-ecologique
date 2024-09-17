import { Result } from 'true-myth'
import { ProgramTypeWithPublicode } from '@tee/data'
import { QuestionnaireData } from '@tee/common'

export type CurrentDateProvider = {
  get: () => string // fr-FR formatted, e.g. "20/12/2023"
}

export interface ProgramRepository {
  getById: (id: string) => ProgramTypeWithPublicode | undefined
  getAll: () => ProgramTypeWithPublicode[]
}

export interface RulesManager {
  evaluate: (
    ruleName: string,
    program: ProgramTypeWithPublicode,
    questionnaireData: QuestionnaireData,
    currentDate: string
  ) => Result<boolean | undefined, Error>
}
