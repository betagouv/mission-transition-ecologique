import { ProgramRepository } from '../domain/spi'
import { jsonPrograms } from '@tee/data/static'
import { ProgramType, AbstractProgramType, ProgramTypes } from '@tee/data'

export default class ProgramsJson implements ProgramRepository {
  private static instance: ProgramsJson
  private _allPrograms: AbstractProgramType[] = []
  private _programs: ProgramType[] = []
  private _externalPrograms: AbstractProgramType[] = []

  private constructor() {
    this._allPrograms = jsonPrograms as unknown as AbstractProgramType[]
    this._programs = this._allPrograms.filter((program) => program['type'] === ProgramTypes.TEE) as ProgramType[]
    this._externalPrograms = this._allPrograms.filter((program) => program['type'] === ProgramTypes.extAdeme)
  }

  public static getInstance(): ProgramsJson {
    if (!ProgramsJson.instance) {
      ProgramsJson.instance = new ProgramsJson()
    }

    return ProgramsJson.instance
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

  public getExternals(): AbstractProgramType[] {
    return this._externalPrograms
  }

  public getExternalById = (id: string): AbstractProgramType | undefined => {
    return this._externalPrograms.find((program: AbstractProgramType) => program.id === id)
  }
}
