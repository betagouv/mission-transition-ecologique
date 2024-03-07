import { Result } from 'true-myth'

import { Program } from '@tee/data/src/type/program'
import ProgramFeatures from '../domain/programFeatures'
import { QuestionnaireData } from '../domain/types'

import ProgramsJson from '../infrastructure/programsJson'
import { currentDateService } from '../infrastructure/currentDate'
import { publicodesService } from '../infrastructure/publicodes'

export default class ProgramService {
  private _program: ProgramFeatures

  constructor() {
    this._program = new ProgramFeatures(ProgramsJson.getInstance(), currentDateService, publicodesService)
  }

  public getById(id: string): Program | undefined {
    return this._program.getById(id)
  }

  public getFilteredPrograms(questionnaireData: QuestionnaireData): Result<Program[], Error> {
    return this._program.getFilteredBy(questionnaireData)
  }
}
