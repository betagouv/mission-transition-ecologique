import { Result } from 'true-myth'
import { ProgramType } from '@tee/data'
import ProgramFeatures from '../domain/programFeatures'
import ProgramsJson from '../infrastructure/programsJson'
import { currentDateService } from '../infrastructure/currentDate'
import { PublicodesService } from '../infrastructure/publicodesService'
import { Objective, QuestionnaireData } from '@tee/common'

export class ProgramService {
  private _program: ProgramFeatures

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

  public getAll(): ProgramType[] {
    return this._program.getAll()
  }

  public getObjectives(id: string): Objective[] {
    return this._program.getObjectives(id)
  }
}
