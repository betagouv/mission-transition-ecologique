// import { AdemeApi } from './ademeApi'
import { AdemeProgramDetail } from './ademeProgramType'
import { TempAdemeApi } from './tmp_to_commit/tmpAdemeApi'

import { ProgramAdemeBaserow } from '../../common/baserow/programAdemeBaserow'
import { AdemeProgramBaserowToStaticConverter } from './ademeProgramBaserowToStaticConverter'
import { FileManager } from '../../common/fileManager'
import { AbstractProgramType, ProgramTypes } from '../../program/types/shared'
import { AdemeToDataProgramConverter } from './ademeToDataProgramConverter'

export class AdemeDataManager {
  private readonly _ademeApi: TempAdemeApi
  private readonly _converter: AdemeToDataProgramConverter
  private readonly _baserow: ProgramAdemeBaserow
  private readonly _staticConverter: AdemeProgramBaserowToStaticConverter

  constructor(
    ademeApi: TempAdemeApi,
    converter: AdemeToDataProgramConverter,
    baserow: ProgramAdemeBaserow,
    staticConverter: AdemeProgramBaserowToStaticConverter
  ) {
    this._ademeApi = ademeApi
    this._converter = converter
    this._baserow = baserow
    this._staticConverter = staticConverter
  }

  async updateData(reload = false): Promise<void> {
    try {
      console.log('Starting ADEME data update...')

      const rawPrograms = await this._ademeApi.getPrograms(reload)

      if (!rawPrograms || rawPrograms.length === 0) {
        console.error('Failed to fetch programs from ADEME API')
        return
      }

      console.log(`Fetched ${rawPrograms.length} programs from ADEME API`)

      const baserowPrograms = rawPrograms.map((program) =>
        this._converter.convertAdemeProgramRawToAdemeProgramBaserow(program as AdemeProgramDetail)
      )
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
      const staticAdemePrograms = this._staticConverter.convertToStaticArray(ademePrograms)

      let existingPrograms: AbstractProgramType[] = []
      try {
        existingPrograms = FileManager.readJson<AbstractProgramType[]>('static/programs.json')
      } catch (error) {
        console.warn('Could not read existing programs.json to update the ademe data')
      }
      const nonAdemePrograms = existingPrograms.filter((program) => program['type'] !== ProgramTypes.extAdeme)
      const updatedPrograms = [...nonAdemePrograms, ...staticAdemePrograms]
      FileManager.writeJson(
        'static/programs.json',
        updatedPrograms,
        '🖊️  Updated programs JSON successfully written to static/programs.json'
      )

      console.log(`${staticAdemePrograms.length} ADEME programs exported to static/programs.json`)
      console.log(`Total programs in file: ${updatedPrograms.length}`)
    } catch (error) {
      console.error('Error exporting ADEME programs:', error)
      throw error
    }
  }
}
