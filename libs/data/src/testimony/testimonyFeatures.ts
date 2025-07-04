import path from 'path'
import { fileURLToPath } from 'url'
import { FileManager } from '../common/fileManager'
import { TestimonyBaserow } from '../common/baserow/testimonyBaserow'

export class TestimonyFeatures {
  private readonly __dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _outputFilePath: string = path.join(this.__dirname, '../../static/testimonies.json')
  private readonly _outputImageDirectory: string = path.join(this.__dirname, '../../../../apps/nuxt/src/public/images/testimony')

  async updateTestimonyData() {
    const testimonies = await new TestimonyBaserow(this._outputImageDirectory).getAll()
    FileManager.writeJson(this._outputFilePath, testimonies, 'testimonies.json updated')
  }
}
