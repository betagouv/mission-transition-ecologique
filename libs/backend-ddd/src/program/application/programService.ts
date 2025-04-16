import { Result } from 'true-myth'
import { ProgramType, ProgramTypeWithEligibility } from '@tee/data'
import ProgramFeatures from '../domain/programFeatures'
import ProgramsJson from '../infrastructure/programsJson'
import { currentDateService } from '../infrastructure/currentDate'
import { PublicodesService } from '../infrastructure/publicodesService'
import { Objective, QuestionnaireData } from '@tee/common'
import FrontConverter from '../infrastructure/frontConverter'
import { RedirectService } from '../../common/application/redirectService'

export class ProgramService {
  private _program: ProgramFeatures

  public static init(): void {
    PublicodesService.init(ProgramsJson.getInstance().getAll())
  }

  public constructor() {
    const programsService = ProgramsJson.getInstance()
    this._program = new ProgramFeatures(programsService, currentDateService, PublicodesService.getInstance())
  }

  public getRedirect(slug: string): string | undefined {
    return new RedirectService().getByProgramSlug(slug)
  }

  public getById(id: string): ProgramType | undefined {
    return this._program.getById(id)
  }

  public getOneWithMaybeEligibility(id: string, questionnaireData: QuestionnaireData): Result<ProgramTypeWithEligibility, Error> {
    return this._program.getOneWithMaybeEligibility(id, questionnaireData)
  }

  public getFilteredPrograms(questionnaireData: QuestionnaireData): Result<ProgramTypeWithEligibility[], Error> {
    return this._program.getFilteredBy(questionnaireData)
  }

  public convertDomainToFront(program: ProgramTypeWithEligibility) {
    return new FrontConverter().convertDomainToFront(program)
  }

  public getAll(): ProgramType[] {
    return this._program.getAll()
  }

  public getObjectives(id: string): Objective[] {
    return this._program.getObjectives(id)
  }
}
