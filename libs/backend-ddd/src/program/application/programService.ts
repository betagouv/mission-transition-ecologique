import { Result } from 'true-myth'
import { ProgramType, ProgramTypeWithEligibility } from '@tee/data'
import { ProgramEligibilityEvaluator } from '../domain/programEligibilityEvaluator'
import ProgramFeatures from '../domain/programFeatures'
import ProgramsJson from '../infrastructure/programsJson'
import { PublicodesService } from '../infrastructure/publicodesService'
import { QuestionnaireData } from '@tee/common'
import FrontConverter from '../infrastructure/frontConverter'
import { RedirectService } from '../../common/application/redirectService'

export class ProgramService {
  public program: ProgramFeatures
  private static _withPublicodes = false

  public static init(): void {
    if (this._withPublicodes) {
      PublicodesService.init(ProgramsJson.getInstance().getAll())
    }
  }

  public static withPublicodes(): void {
    this._withPublicodes = true
  }

  public static isPublicodesEvaluator(): boolean {
    return this._withPublicodes
  }

  public constructor(_withPublicodes = false) {
    const programRepository = ProgramsJson.getInstance()
    const evaluator =
      _withPublicodes || ProgramService._withPublicodes ? PublicodesService.getInstance() : new ProgramEligibilityEvaluator()

    this.program = new ProgramFeatures(programRepository, evaluator)
  }

  public getRedirect(slug: string): string | undefined {
    return new RedirectService().getByProgramSlug(slug)
  }

  public getById(id: string): ProgramType | undefined {
    return this.program.getOneById(id)
  }

  public getOneWithMaybeEligibility(id: string, questionnaireData: QuestionnaireData): Result<ProgramTypeWithEligibility, Error> {
    return this.program.getOneByIdWithMaybeEligibility(id, questionnaireData)
  }

  public getFilteredPrograms(questionnaireData: QuestionnaireData): Result<ProgramTypeWithEligibility[], Error> {
    return this.program.getFilteredBy(questionnaireData)
  }

  public convertDomainToFront(program: ProgramTypeWithEligibility) {
    return new FrontConverter().convertDomainToFront(program)
  }

  public getAll(): ProgramType[] {
    return this.program.getAll()
  }
}
