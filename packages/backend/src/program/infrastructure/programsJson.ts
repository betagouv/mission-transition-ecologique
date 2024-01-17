import jsonPrograms from '@tee/web/public/data/generated/dataset_out.json'

import { ProgramRepository } from '../domain/spi'
import { Program } from '../domain/types'

export default class ProgramsJson implements ProgramRepository {
  private static instance: ProgramsJson
  private _programs: Program[] = []

  private constructor() {
    this.programs = jsonPrograms as unknown as Program[]
  }

  public static getInstance(): ProgramsJson {
    if (!ProgramsJson.instance) {
      ProgramsJson.instance = new ProgramsJson()
    }

    return ProgramsJson.instance
  }

  get programs(): Program[] {
    return this._programs
  }

  set programs(programs: Program[]) {
    this._programs = programs
  }

  getById = (id: string): Program | undefined => {
    return this.programs.find((programData: Program) => programData.id === id)
  }
}
