import { ProgramRepository, EligibilityEvaluator } from './spi'
import { ProgramFilter } from './filterPrograms'
import { sortPrograms } from './sortPrograms'
import { Result } from 'true-myth'
import {
  AbstractProgramType,
  AbstractProgramTypeForFront,
  ProgramEligibilityStatus,
  ProgramType,
  ProgramTypeWithEligibility
} from '@tee/data'
import { QuestionnaireData } from '@tee/common'
import { Monitor } from '../../common'
import ProgramCustomizer from './programCustomizer'
import { ProgramNotFoundError } from './types'
import FrontConverter from '../infrastructure/frontConverter'

export default class ProgramFeatures {
  constructor(
    private _programRepository: ProgramRepository,
    private _eligibilityEvaluator: EligibilityEvaluator | undefined = undefined
  ) {}

  public getOneById(id: string): ProgramType | undefined {
    return this._programRepository.getById(id)
  }

  public getOneInternalByIdWithMaybeEligibility(
    id: string,
    questionnaireData: QuestionnaireData
  ): Result<ProgramTypeWithEligibility, Error> {
    let program = this.getOneById(id)
    if (!program) {
      Monitor.warning('Requested Program Id unknown', { id })
      return Result.err(new ProgramNotFoundError())
    }
    if (new ProgramCustomizer().shouldRewritePrograms(questionnaireData)) {
      program = JSON.parse(JSON.stringify(program)) as ProgramType // deep copy before modification
      program = new ProgramCustomizer().rewriteOneProgram(program, questionnaireData)
    }

    if (Object.keys(questionnaireData).length === 0) {
      return Result.ok({ ...program, eligibility: ProgramEligibilityStatus.Unknown })
    }

    if (!this._eligibilityEvaluator) {
      return Result.err(new Error('RulesService should be defined to evaluate a program'))
    }

    const programWithEligibility = new ProgramFilter(this._eligibilityEvaluator).evaluateOneEligibility(program, questionnaireData)
    if (programWithEligibility.isErr) {
      return Result.err(programWithEligibility.error)
    }

    return Result.ok(programWithEligibility.value)
  }

  private _getFilteredByInternal(questionnaireData: QuestionnaireData): Result<ProgramTypeWithEligibility[], Error> {
    if (!this._eligibilityEvaluator) {
      return Result.err(new Error('RulesService should be defined to filter programs'))
    }

    let allPrograms
    if (new ProgramCustomizer().shouldRewritePrograms(questionnaireData)) {
      const editablePrograms = this._programRepository.getEditablePrograms()
      allPrograms = new ProgramCustomizer().getAllPersonalizedPrograms(editablePrograms, questionnaireData)
    } else {
      allPrograms = this._programRepository.getAll()
    }

    let filteredPrograms = new ProgramFilter(this._eligibilityEvaluator).byEligibility(allPrograms, questionnaireData)

    if (questionnaireData.is_questionnaire) {
      filteredPrograms = filteredPrograms.map((programs) => sortPrograms(programs))
    }
    return filteredPrograms
  }

  public getAll(): ProgramType[] {
    return this._programRepository.getAll()
  }

  public getExternals(): AbstractProgramType[] {
    return this._programRepository.getExternals()
  }

  public getExternalById(id: string): AbstractProgramType | undefined {
    return this._programRepository.getExternalById(id)
  }

  public getOneWithMaybeEligibilityForFront(id: string, questionnaireData: QuestionnaireData): Result<AbstractProgramTypeForFront, Error> {
    const program = this.getOneInternalByIdWithMaybeEligibility(id, questionnaireData)

    if (program.isErr) {
      if (program.error instanceof ProgramNotFoundError) {
        const externalProgram = this.getExternalById(id)

        if (externalProgram) {
          return Result.ok(externalProgram as AbstractProgramTypeForFront)
        }

        return Result.err(program.error)
      }

      return Result.err(program.error)
    }

    const frontConverter = new FrontConverter()
    return Result.ok(frontConverter.convertDomainToFront(program.value) as AbstractProgramTypeForFront)
  }

  public getFilteredProgramsForFront(questionnaireData: QuestionnaireData): Result<AbstractProgramTypeForFront[], Error> {
    const programsResult = this._getFilteredByInternal(questionnaireData)

    if (programsResult.isErr) {
      return Result.err(programsResult.error)
    }

    const frontConverter = new FrontConverter()
    const teePrograms = programsResult.value.map((program) => frontConverter.convertDomainToFront(program))
    const externalPrograms = this.getExternals()

    return Result.ok([...teePrograms, ...externalPrograms] as AbstractProgramTypeForFront[])
  }
}
