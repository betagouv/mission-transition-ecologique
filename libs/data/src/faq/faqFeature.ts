import { FaqBaserowInterface } from '../common/baserow/types'
import { FileManager } from '../common/fileManager'
import { FaqConverterInterface, FaqFilterInterface } from './types/domain'
import { FaqPage } from './types/shared'
import path from 'path'
import { fileURLToPath } from 'url'
import { LoggerInterface } from '../common/logger/types'

export class FaqFeature {
  private readonly __dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _outputdirPath: string = path.join(this.__dirname, '../../static/frontend/faq')

  constructor(
    private _baserow: FaqBaserowInterface,
    private _converter: FaqConverterInterface,
    private _filter: FaqFilterInterface,
    private _logger: LoggerInterface
  ) {}

  async generateFaqJson(): Promise<void> {
    console.log(`Start loading Baserow data.`)
    const { baserowFaqs, baserowFaqSections } = await this._baserow.getFaqs()

    const baserowFaqsFiltered = this._filter.byActive(baserowFaqs)

    console.log(`Start converting Baserow data to domain.`)
    const faqs = this._converter.toDomain(baserowFaqsFiltered, baserowFaqSections)

    console.log(`Start validating FAQ data.`)
    await this._filter.byValidity(faqs)

    console.log(`Start generating the project JSON.`)
    for (const page of Object.values(FaqPage)) {
      FileManager.writeJson(this._outputdirPath + `/${page}.json`, faqs[page as FaqPage] ?? [], `faq ${page}.json updated`)
    }

    this._logger.write('generateFaqJson.log')
  }
}
