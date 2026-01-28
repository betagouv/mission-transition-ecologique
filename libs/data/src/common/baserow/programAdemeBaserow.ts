import { AbstractBaserow } from './abstractBaserow'
import { FilterBaserow } from './filterBaserow'
import { GeographicAreas } from '../../program/types/domain'
import { AdemeProgramBaserow } from './types'
import ConfigBaserow from '../../config/configBaserow'

export class ProgramAdemeBaserow extends AbstractBaserow {
  private readonly _programAdemeTableId = ConfigBaserow.PROGRAM_ADEME_ID

  async getAll(): Promise<AdemeProgramBaserow[]> {
    return await this._getTableData<AdemeProgramBaserow>(this._programAdemeTableId)
  }

  async getByR2daId(r2daId: string): Promise<AdemeProgramBaserow | null> {
    const filter = new FilterBaserow('AND').withFieldEqualToValue('r2daId', r2daId)

    const results = await this._getTableData<AdemeProgramBaserow>(this._programAdemeTableId, filter)
    return results.length > 0 ? results[0] : null
  }

  async createProgram(program: Omit<AdemeProgramBaserow, 'id'>): Promise<void> {
    await this._createRow<AdemeProgramBaserow>(this._programAdemeTableId, program)
  }

  async updateProgram(rowId: number, program: Partial<AdemeProgramBaserow>): Promise<void> {
    await this._patchRow<AdemeProgramBaserow>(this._programAdemeTableId, rowId, program)
  }

  async upsertProgram(program: AdemeProgramBaserow): Promise<void> {
    try {
      const existingProgram = await this.getByR2daId(program.r2daId)

      if (existingProgram && 'id' in existingProgram) {
        await this.updateProgram(existingProgram.id as number, program)
      } else {
        await this.createProgram(program)
      }

      await this._delay(100)
    } catch (error) {
      console.error(`Error upserting program with r2daId ${program.r2daId}:`, error)
      throw error
    }
  }

  async upsertPrograms(programs: AdemeProgramBaserow[]): Promise<void> {
    console.log('Updating programs in baserow')
    const total = programs.length
    for (let i = 0; i < programs.length; i++) {
      await this.upsertProgram(programs[i])
      if ((i + 1) % 10 === 0 || i === programs.length - 1) {
        console.log(`Progress: ${i + 1}/${total} programs processed`)
      }
    }
  }

  async getProgramsWithoutDispositifAssocie(): Promise<AdemeProgramBaserow[]> {
    const filter = new FilterBaserow('AND').withEmpty('Dispositif associé')
    return await this._getTableData<AdemeProgramBaserow>(this._programAdemeTableId, filter)
  }

  async getGeographicAreas(): Promise<GeographicAreas[]> {
    return await this._getTableData<GeographicAreas>(this._geographicAreasTableId)
  }
}
