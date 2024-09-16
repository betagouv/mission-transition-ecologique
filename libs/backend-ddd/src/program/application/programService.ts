import { Result } from 'true-myth'
import { ProgramType } from '@tee/data'
import ProgramFeatures from '../domain/programFeatures'
import ProgramsJson from '../infrastructure/programsJson'
import { currentDateService } from '../infrastructure/currentDate'
import { PublicodesService } from '../infrastructure/publicodesService'
import { Objective, QuestionnaireData } from '@tee/common'
import ProgramCache from './programCache'
import FrontConverter from '../infrastructure/frontConverter'

export class ProgramService {
  private _program: ProgramFeatures
  private _cache = ProgramCache.getInstance()

  public static init(): void {
    PublicodesService.init(ProgramsJson.getInstance().getAll())
  }

  public constructor() {
    const programsService = ProgramsJson.getInstance()
    this._program = new ProgramFeatures(programsService, currentDateService, PublicodesService.getInstance())
  }

  public getById(id: string): ProgramType | undefined {
    return this._program.getById(id)
  }

  public getFilteredPrograms(questionnaireData: QuestionnaireData): Result<ProgramType[], Error> {
    return this._program.getFilteredBy(questionnaireData)
  }

  public convertDomainToFront(program: ProgramType) {
    return new FrontConverter().convertDomainToFront(program)
  }

  public getAll(): ProgramType[] {
    return this._program.getAll()
  }

  public getPaginatedPrograms(questionnaireData: QuestionnaireData, page: number, pageSize: number): Result<ProgramType[], Error> {
    const hash = this._cache.generateHash(questionnaireData)
    let programs = this._cache.getCache(hash)

    if (!programs) {
      programs = this.getFilteredPrograms(questionnaireData)
      if (programs.isOk) {
        this._cache.setCache(hash, programs.value)
      }
    }

    if (programs.isErr) {
      return programs
    } else {
      console.log(page, pageSize)
      return Result.ok(programs.value.slice((page - 1) * pageSize, page * pageSize))
    }
  }

  public getObjectives(id: string): Objective[] {
    return this._program.getObjectives(id)
  }
}
