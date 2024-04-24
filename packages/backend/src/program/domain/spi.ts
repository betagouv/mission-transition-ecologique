import { Result } from 'true-myth'
import type { Program, QuestionnaireData } from './types/types'

export type CurrentDateService = {
  get: () => string // fr-FR formatted, e.g. "20/12/2023"
}

export interface ProgramRepository {
  getById: (id: string) => Program | undefined
  getAll: () => Program[]
}

export interface RulesService {
  evaluate: (
    ruleName: string,
    program: Program,
    questionnaireData: QuestionnaireData,
    currentDate: string
  ) => Result<boolean | undefined, Error>
}
