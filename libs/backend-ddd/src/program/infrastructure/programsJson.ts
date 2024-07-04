import { ProgramRepository } from '../domain/spi'
import { jsonPrograms } from '@tee/data/generated'
import { ProgramType } from '@tee/data'

export default class ProgramsJson implements ProgramRepository {
  private static instance: ProgramsJson
  private _programs: ProgramType[] = []

  private constructor() {
    this._programs = jsonPrograms as unknown as ProgramType[]
  }

  public static getInstance(): ProgramsJson {
    if (!ProgramsJson.instance) {
      ProgramsJson.instance = new ProgramsJson()
    }

    return ProgramsJson.instance
  }

  public getAll(): ProgramType[] {
    return this._programs
  }
  public getById = (id: string): ProgramType | undefined => {
    return this.getAll().find((programData: ProgramType) => programData.id === id)
  }
}
