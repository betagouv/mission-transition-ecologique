import path from 'path'
import { FileManager } from '../../common/fileManager'
import { AdemeApi } from './ademeApi'

export class AdemeDataManager {
  private readonly _ademeApi: AdemeApi
  private readonly _tempFilePath: string

  constructor() {
    this._ademeApi = new AdemeApi()
    this._tempFilePath = path.join(process.cwd(), 'ademe-dispositifs.json')
  }

  async updateData(): Promise<void> {
    try {
      console.log('Starting ADEME data update...')

      const dispositifs = await this._ademeApi.getListeDispositif()

      if (!dispositifs) {
        console.error('Failed to fetch dispositifs from ADEME API')
        return
      }

      console.log(`Fetched ${dispositifs.length} dispositifs from ADEME API`)

      // Write data to temporary file
      FileManager.writeJson(this._tempFilePath, dispositifs, `✅ ADEME dispositifs data written to ${this._tempFilePath}`)

      console.log('ADEME data update completed successfully')
    } catch (error) {
      console.error('Error updating ADEME data:', error)
      throw error
    }
  }
}
