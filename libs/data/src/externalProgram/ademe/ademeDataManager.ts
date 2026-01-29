// import { AdemeApi } from './ademeApi'
import { AdemeProgramDetail } from './ademeProgramType'
import { TempAdemeApi } from './tmpAdemeApi'

import { ProgramAdemeBaserow } from '../../common/baserow/programAdemeBaserow'
import { AdemeProgramBaserowToAbstractDto } from './ademeProgramBaserowToAbstractDto'
import { FileManager } from '../../common/fileManager'
import { AbstractProgramType, ProgramTypes } from '../../program/types/shared'
import { AdemeToAdemeBaserowProgramDto } from './ademeToAdemeBaserowProgramDto'

export class AdemeDataManager {
  constructor(
    private readonly _ademeApi: TempAdemeApi,
    private readonly _converter: AdemeToAdemeBaserowProgramDto,
    private readonly _baserow: ProgramAdemeBaserow,
    private readonly _staticConverter: AdemeProgramBaserowToAbstractDto
  ) {}
  async updateData(): Promise<void> {
    try {
      console.log('Starting ADEME data update...')

      const rawPrograms = await this._ademeApi.getPrograms()

      if (!rawPrograms || rawPrograms.length === 0) {
        console.error('Failed to fetch programs from ADEME API')
        return
      }

      console.log(`Fetched ${rawPrograms.length} programs from ADEME API`)

      const baserowPrograms = rawPrograms.map((program) => this._converter.convert(program as AdemeProgramDetail))
      await this._baserow.upsertPrograms(baserowPrograms)
      await this._exportPrograms()

      console.log('ADEME data update completed successfully')
    } catch (error) {
      console.error('Error updating ADEME data:', error)
      throw error
    }
  }

  private async _exportPrograms(): Promise<void> {
    try {
      const ademePrograms = await this._baserow.getProgramsWithoutDispositifAssocie()
      const abstractPrograms = this._staticConverter.convertArray(ademePrograms)

      let existingPrograms: AbstractProgramType[] = []
      try {
        existingPrograms = FileManager.readJson<AbstractProgramType[]>('static/programs.json')
      } catch (error) {
        console.warn('Could not read existing programs.json to update the ademe data')
      }
      const nonAdemePrograms = existingPrograms.filter((program) => program['type'] !== ProgramTypes.extAdeme)
      const updatedPrograms = [...nonAdemePrograms, ...abstractPrograms]
      FileManager.writeJson(
        'static/programs.json',
        updatedPrograms,
        '🖊️  Updated programs JSON successfully written to static/programs.json'
      )

      console.log(`${abstractPrograms.length} ADEME programs exported to static/programs.json`)
      console.log(`Total programs in file: ${updatedPrograms.length}`)
    } catch (error) {
      console.error('Error exporting ADEME programs:', error)
      throw error
    }
  }
}
