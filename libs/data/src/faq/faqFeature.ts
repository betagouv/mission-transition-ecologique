import { FileManager } from '../common/fileManager'
import { FaqFilterInterface, FaqRepositoryInterface } from './types/domain'
import { FaqPage } from './types/shared'
import path from 'path'
import { fileURLToPath } from 'url'
import { LoggerInterface } from '../common/logger/types'

export class FaqFeature {
  private readonly _dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _outputdirPath: string = path.join(this._dirname, '../../../../apps/nuxt/src/public/json/faq')

  constructor(
    private _baserow: FaqRepositoryInterface,
    private _filter: FaqFilterInterface,
    private _logger: LoggerInterface
  ) {}

  async generateFaqJson(): Promise<void> {
    console.log(`Start loading Baserow data and convert to domain.`)
    const faqs = await this._baserow.getFaqs()

    console.log(`Start validating FAQ data.`)
    await this._filter.byValidity(faqs)

    console.log(`Start generating the project JSON.`)
    FileManager.createFolderIfNotExists(this._outputdirPath)
    for (const page of Object.values(FaqPage)) {
      FileManager.writeJson(this._outputdirPath + `/${page}.json`, faqs[page as FaqPage] ?? [], `faq ${page}.json updated`)
    }

    this._logger.write('generateFaqJson.log')
  }
}
