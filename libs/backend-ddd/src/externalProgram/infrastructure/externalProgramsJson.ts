import { ExternalProgramRepository } from '../domain/spi'
import { externalJsonPrograms } from '@tee/data/static'
import { ExternalProgramType } from '@tee/data'

export default class ExternalProgramsJson implements ExternalProgramRepository {
  private static instance: ExternalProgramsJson
  private _programs: ExternalProgramType[] = []

  private constructor() {
    this._programs = externalJsonPrograms as unknown as ExternalProgramType[]
  }

  public static getInstance(): ExternalProgramsJson {
    if (!ExternalProgramsJson.instance) {
      ExternalProgramsJson.instance = new ExternalProgramsJson()
    }

    return ExternalProgramsJson.instance
  }

  public getAll(): ExternalProgramType[] {
    return this._programs
  }

  public getById(id: string): ExternalProgramType | undefined {
    return this.getAll().find((programData: ExternalProgramType) => programData.id === id)
  }
}
