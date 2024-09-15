import { CurrentDateProvider, ProgramRepository, RulesManager } from './spi'
import { filterPrograms } from './filterPrograms'
import { sortPrograms } from './sortPrograms'
import { Result } from 'true-myth'
import { ProgramType } from '@tee/data'
import { Objective, QuestionnaireData } from '@tee/common'

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

  public getFilteredBy(questionnaireData: QuestionnaireData): Result<ProgramType[], Error> {
    const allPrograms = this._programRepository.getAll()
    if (!this._currentDateService || !this._rulesService) {
      return Result.err(new Error('currentDateService and rulesService should be defined to filter programs'))
    }
    const allPersonalizedPrograms = this._programRepository.personalizePrograms(allPrograms, questionnaireData)

    let filteredPrograms = filterPrograms(allPersonalizedPrograms, questionnaireData, this._currentDateService.get(), this._rulesService)
    const route = questionnaireData.questionnaire_route
    if (route) {
      filteredPrograms = filteredPrograms.map((programs) => sortPrograms(programs, route))
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
}
