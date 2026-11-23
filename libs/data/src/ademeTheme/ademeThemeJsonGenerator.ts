import path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import { FileManager } from '../common/fileManager'
import { AdemeTheme } from './types/domain'
import { AdemeThemeReferential } from './ademeThemeReferential'

const OUTPUT_FOLDER_PATH = '../../static'
const OUTPUT_FILENAME = 'ademe_themes.json'

export class AdemeThemeJsonGenerator {
  private readonly _dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _outputDir = path.join(this._dirname, OUTPUT_FOLDER_PATH)

  async export(themes: AdemeTheme[]): Promise<void> {
    const referential = AdemeThemeReferential.build(themes)
    // An empty list means that Baserow could not be read: keep the previous referential
    if (!referential.length) {
      console.error('⚠️  No ADEME theme found, the ADEME theme referential is not updated')
      return
    }

    FileManager.createFolderIfNotExists(this._outputDir)
    fs.writeFileSync(path.join(this._outputDir, OUTPUT_FILENAME), JSON.stringify(referential, null, 2) + '\n', 'utf8')
    console.log('🖊️  ADEME theme referential successfully written')
  }
}
