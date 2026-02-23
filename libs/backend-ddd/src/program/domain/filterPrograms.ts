import { Result } from 'true-myth'
import { EligibilityEvaluator } from './spi'
import { ProgramEligibilityStatus, ProgramType, ProgramTypeWithEligibility } from '@tee/data'
import { QuestionnaireData } from '@tee/common'

export class ProgramFilter {
  constructor(private _eligibilityEvaluator: EligibilityEvaluator) {}

  public byEligibility(programs: ProgramType[], questionnaireData: QuestionnaireData): Result<ProgramTypeWithEligibility[], Error> {
    const filteredPrograms: ProgramTypeWithEligibility[] = []

    for (const program of programs) {
      const programWithEligibility = this.evaluateOneEligibility(program, questionnaireData)
      if (programWithEligibility.isErr) {
        return Result.err(this._addErrorDetails(programWithEligibility.error, program.id))
      }

      if (this._shouldKeepProgram(programWithEligibility.value.eligibility, questionnaireData.onlyEligible)) {
        filteredPrograms.push(programWithEligibility.value)
      }
    }

    return Result.ok(filteredPrograms)
  }

  public evaluateOneEligibility(program: ProgramType, questionnaireData: QuestionnaireData): Result<ProgramTypeWithEligibility, Error> {
    const evaluation = this._eligibilityEvaluator.evaluate(program, questionnaireData)

    if (evaluation.isErr) {
      return Result.err(this._addErrorDetails(evaluation.error, program.id))
    }

    return Result.ok(evaluation.value)
  }

  private _addErrorDetails(err: Error, programName: string): Error {
    return new Error(`Evaluation of rule failed on program with id ${programName}`)
  }

  private _shouldKeepProgram(programEligibility: ProgramEligibilityStatus, onlyEligible: boolean | undefined): boolean {
    if (programEligibility === ProgramEligibilityStatus.ProgramEol) {
      return false
    }

    if (onlyEligible === false) {
      return true
    }

    return programEligibility !== ProgramEligibilityStatus.NotEligible
  }
}
