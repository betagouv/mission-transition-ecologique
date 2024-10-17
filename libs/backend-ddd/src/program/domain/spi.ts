import { Result } from 'true-myth'
import { ProgramType } from '@tee/data'
import { QuestionnaireData } from '@tee/common'

export type CurrentDateProvider = {
  get: () => string // fr-FR formatted, e.g. "20/12/2023"
}

export interface ProgramRepository {
  getEditablePrograms(): ProgramType[]
  getById: (id: string) => ProgramType | undefined
  getAll: () => ProgramType[]
}

export interface RulesManager {
  evaluate: (
    ruleName: string,
    program: ProgramType,
    questionnaireData: QuestionnaireData,
    currentDate: string
  ) => Result<boolean | undefined, Error>
}
