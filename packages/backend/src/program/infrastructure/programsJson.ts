import jsonPrograms from '@tee/web/public/data/generated/dataset_out.json'

import { ProgramRepository } from '../domain/spi'
import { Program } from '../domain/type/types'

export default class ProgramsJson implements ProgramRepository {
  private static instance: ProgramsJson
  private _programs: Program[] = []

  private constructor() {
    this._programs = jsonPrograms as unknown as Program[]
  }

  public static getInstance(): ProgramsJson {
    if (!ProgramsJson.instance) {
      ProgramsJson.instance = new ProgramsJson()
    }

    return ProgramsJson.instance
  }

  public getAll(): Program[] {
    return this._programs
  }
  public getById = (id: string): Program | undefined => {
    return this.getAll().find((programData: Program) => programData.id === id)
  }
}
