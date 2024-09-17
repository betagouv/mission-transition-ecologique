import { ProgramRepository } from '../domain/spi'
import { jsonPrograms } from '@tee/data/generated'
import { ProgramTypeWithPublicode } from '@tee/data'

export default class ProgramsJson implements ProgramRepository {
  private static instance: ProgramsJson
  private _programs: ProgramTypeWithPublicode[] = []

  private constructor() {
    this._programs = jsonPrograms as unknown as ProgramTypeWithPublicode[]
  }

  public static getInstance(): ProgramsJson {
    if (!ProgramsJson.instance) {
      ProgramsJson.instance = new ProgramsJson()
    }

    return ProgramsJson.instance
  }

  public getAll(): ProgramTypeWithPublicode[] {
    return this._programs
  }
  public getById = (id: string): ProgramTypeWithPublicode | undefined => {
    return this.getAll().find((programData: ProgramTypeWithPublicode) => programData.id === id)
  }
}
