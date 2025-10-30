import { Result } from 'true-myth'
import { ProgramType, ProgramTypeWithEligibility } from '@tee/data'
import { QuestionnaireData } from '@tee/common'

export interface ProgramRepository {
  getEditablePrograms(): ProgramType[]
  getById: (id: string) => ProgramType | undefined
  getAll: () => ProgramType[]
}

export interface EligibilityEvaluator {
  evaluate: (program: ProgramType, questionnaireData: QuestionnaireData) => Result<ProgramTypeWithEligibility, Error>
}
