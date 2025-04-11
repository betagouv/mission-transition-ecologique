import { CurrentDateProvider, ProgramRepository, RulesManager } from './spi'
import { evaluateProgramEligibility, filterPrograms } from './filterPrograms'
import { sortPrograms } from './sortPrograms'
import { Result } from 'true-myth'
import { ProgramEligibilityType, ProgramType, ProgramTypeWithEligibility } from '@tee/data'
import { Objective, QuestionnaireData } from '@tee/common'
import { Monitor } from '../../common'
import ProgramCustomizer from './programCustomizer'
import { ProgramNotFoundError } from './types'
import { RedirectService } from '../../common/application/redirectService'

export default class ProgramFeatures {
  private _programRepository: ProgramRepository
  private _currentDateService: CurrentDateProvider | undefined
  private _rulesService: RulesManager | undefined

  constructor(
    programRepository: ProgramRepository,
    currentDateService: CurrentDateProvider | undefined = undefined,
    rulesService: RulesManager | undefined = undefined
  ) {
    this._programRepository = programRepository
    this._currentDateService = currentDateService
    this._rulesService = rulesService
  }

  public getById(id: string): ProgramType | undefined {
    return this._programRepository.getById(id)
  }

  public getOneWithMaybeEligibility(id: string, questionnaireData: QuestionnaireData): Result<ProgramTypeWithEligibility, Error> {
    let program = this.getById(id)
    if (!program) {
      Monitor.warning('Requested Program Id unknown', { id })
      return Result.err(new ProgramNotFoundError())
    }
    if (new ProgramCustomizer().shouldRewritePrograms(questionnaireData)) {
      program = JSON.parse(JSON.stringify(program)) as ProgramType // deep copy before modification
      program = new ProgramCustomizer().rewriteOneProgram(program, questionnaireData)
    }

    if (Object.keys(questionnaireData).length === 0) {
      return Result.ok({ ...program, eligibility: ProgramEligibilityType.Unknown })
    }

    if (!this._currentDateService || !this._rulesService) {
      return Result.err(new Error('currentDateService and rulesService should be defined to evaluate a program'))
    }

    const programWithEligibility = evaluateProgramEligibility(
      program,
      questionnaireData,
      this._currentDateService.get(),
      this._rulesService
    )
    if (programWithEligibility.isErr) {
      return Result.err(programWithEligibility.error)
    }

    return Result.ok(programWithEligibility.value)
  }

  public getFilteredBy(questionnaireData: QuestionnaireData): Result<ProgramTypeWithEligibility[], Error> {
    if (!this._currentDateService || !this._rulesService) {
      return Result.err(new Error('currentDateService and rulesService should be defined to filter programs'))
    }
    let allPrograms
    if (new ProgramCustomizer().shouldRewritePrograms(questionnaireData)) {
      const editablePrograms = this._programRepository.getEditablePrograms()
      allPrograms = new ProgramCustomizer().getAllPersonalizedPrograms(editablePrograms, questionnaireData)
    } else {
      allPrograms = this._programRepository.getAll()
    }

    let filteredPrograms = filterPrograms(allPrograms, questionnaireData, this._currentDateService.get(), this._rulesService)
    if (questionnaireData.is_questionnaire) {
      filteredPrograms = filteredPrograms.map((programs) => sortPrograms(programs))
    }
    return filteredPrograms
  }

  public getAll(): ProgramType[] {
    return this._programRepository.getAll()
  }

  public getObjectives(id: string): Objective[] {
    const program = this.getById(id)
    if (program === undefined) {
      return []
    }
    const publicodeObjectives = program.publicodes['entreprise . a un objectif ciblé']?.['une de ces conditions']
    if (!publicodeObjectives) {
      return []
    }
    const objectivesArray: Objective[] = []
    publicodeObjectives.forEach((publicodeObjective) => {
      const objectiveValue = Object.values(Objective).find((value) => publicodeObjective.includes(value as string))
      if (objectiveValue) {
        objectivesArray.push(objectiveValue as Objective)
      }
    })
    return objectivesArray
  }

  public getRedirect(id: string): string | undefined {
    return new RedirectService().getProgramRedirect(id)
  }
}
