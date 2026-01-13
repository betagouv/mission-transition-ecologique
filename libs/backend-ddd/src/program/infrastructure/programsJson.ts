import { ProgramRepository } from '../domain/spi'
import { jsonPrograms } from '@tee/data/static'
import { ProgramType } from '@tee/data'

export default class ProgramsJson implements ProgramRepository {
  private static _instance: ProgramsJson
  private _programs: ProgramType[] = []

  private constructor() {
    this._programs = jsonPrograms as unknown as ProgramType[]
  }

  public static getInstance(): ProgramsJson {
    if (!ProgramsJson._instance) {
      ProgramsJson._instance = new ProgramsJson()
    }

    return ProgramsJson._instance
  }

  public getEditablePrograms(): ProgramType[] {
    return JSON.parse(JSON.stringify(this._programs)) as ProgramType[]
  }

  public getAll(): ProgramType[] {
    return this._programs
  }

  public getById = (id: string): ProgramType | undefined => {
    return this.getAll().find((programData: ProgramType) => programData.id === id)
  }
}
