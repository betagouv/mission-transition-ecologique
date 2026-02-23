import path from 'path'
import { fileURLToPath } from 'url'
import { FileManager } from '../common/fileManager'
import { TestimonyBaserow } from '../common/baserow/testimonyBaserow'

export class TestimonyFeatures {
  private readonly _dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _outputDirPath: string = path.join(this._dirname, '../../../../apps/nuxt/src/public/json/testimony/')
  private readonly _outputFileName: string = 'testimonies.json'
  private readonly _outputImageDirectory: string = path.join(this._dirname, '../../../../apps/nuxt/src/public/images/testimony')

  async updateTestimonyData() {
    const testimonies = await new TestimonyBaserow(this._outputImageDirectory).getAll()
    FileManager.createFolderIfNotExists(this._outputDirPath)
    FileManager.writeJson(this._outputDirPath + this._outputFileName, testimonies, 'testimonies.json updated')
  }
}
