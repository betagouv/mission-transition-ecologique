// import { AdemeApi } from './ademeApi'
import { TempAdemeApi } from './tmp_to_commit/tmpAdemeApi'
import { AdemeToDataProgramConverter } from './tmp_to_commit/tmpAdemeToDataProgramConverter'
import { ProgramAdemeBaserow } from '../../common/baserow/programAdemeBaserow'
import { AdemeProgramBaserowToStaticConverter } from './tmp_to_commit/ademeProgramBaserowToStaticConverter'
import { FileManager } from '../../common/fileManager'

export class AdemeDataManager {
  private readonly _ademeApi: TempAdemeApi
  private readonly _converter: AdemeToDataProgramConverter
  private readonly _baserow: ProgramAdemeBaserow
  private readonly _staticConverter: AdemeProgramBaserowToStaticConverter

  constructor() {
    this._ademeApi = new TempAdemeApi()
    this._converter = new AdemeToDataProgramConverter()
    this._baserow = new ProgramAdemeBaserow()
    this._staticConverter = new AdemeProgramBaserowToStaticConverter()
  }

  async updateData(reload = false): Promise<void> {
    try {
      console.log('Starting ADEME data update...')

      // Fetch raw program data from ADEME API
      const rawPrograms = await this._ademeApi.getPrograms(reload)

      if (!rawPrograms || rawPrograms.length === 0) {
        console.error('Failed to fetch programs from ADEME API')
        return
      }

      console.log(`Fetched ${rawPrograms.length} programs from ADEME API`)

      // Convert raw programs to Baserow format
      const baserowPrograms = rawPrograms.map((program) => this._converter.convertAdemeProgramRawToAdemeProgramBaserow(program))

      console.log(`Converted ${baserowPrograms.length} programs to Baserow format`)

      // Upsert programs to Baserow
      console.log('Upserting programs to Baserow...')
      await this._baserow.upsertPrograms(baserowPrograms)

      console.log('ADEME data upsert completed successfully')

      // Get programs without "Dispositif associé" and export to rawPrograms.json
      await this.exportRawPrograms()

      console.log('ADEME data update completed successfully')
    } catch (error) {
      console.error('Error updating ADEME data:', error)
      throw error
    }
  }

  async exportRawPrograms(): Promise<void> {
    try {
      const ademePrograms = await this._baserow.getProgramsWithoutDispositifAssocie()
      const staticPrograms = this._staticConverter.convertToStaticArray(ademePrograms)
      console.log(staticPrograms)
      FileManager.writeJson(
        'static/rawPrograms.json',
        staticPrograms,
        '🖊️  Raw ADEME programs JSON successfully written to static/rawPrograms.json'
      )

      console.log('Raw ADEME programs export completed successfully')
    } catch (error) {
      console.error('Error exporting raw ADEME programs:', error)
      throw error
    }
  }
}
