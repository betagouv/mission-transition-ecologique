import { BaserowFaq } from '../common/baserow/types'
import { FileManager } from '../common/fileManager'
import { FaqConverter } from './faqConverter'
import { FaqPage, FaqType } from './types/shared'
import path from 'path'
import { fileURLToPath } from 'url'
import { FaqBaserow } from '../common/baserow/faqBaserow'
import { Logger } from '../common/logger/logger'
import { LoggerType, LogLevel } from '../common/logger/types'

export class FaqFeature {
  private readonly __dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _outputdirPath: string = path.join(this.__dirname, '../../static/faq')
  private _logger: Logger

  constructor() {
    this._logger = new Logger(LoggerType.Faq, true)
  }

  async generateFaqJson(): Promise<void> {
    console.log(`Start loading Baserow data.`)
    const { baserowFaqs, baserowFaqSections } = await new FaqBaserow().getFaqs()

    const baserowFaqsFiltered = this._filter(baserowFaqs)

    console.log(`Start converting Baserow data to domain.`)
    const faqs = new FaqConverter().toDomain(baserowFaqsFiltered, baserowFaqSections)

    console.log(`Start validating FAQ data.`)
    await this._validateData(faqs)

    console.log(`Start generating the project JSON.`)
    for (const page in faqs) {
      FileManager.writeJson(this._outputdirPath + `/${page}.json`, faqs[page as FaqPage], `faq ${page}.json updated`)
    }
  }

  private _filter(baserowFaqs: BaserowFaq[]) {
    return baserowFaqs.filter((faq) => faq.Actif)
  }

  private async _validateData(faqs: FaqType) {
    for (const page in faqs) {
      const faqSections = faqs[page as FaqPage]

      if (!faqSections) {
        continue
      }

      for (const section of faqSections) {
        for (const faq of section.questions) {
          let messageContext: string | undefined

          if (!faq.question) {
            messageContext = `Question non fournie`
          }

          if (!faq.answer) {
            messageContext = `Réponse non fournie`
          }

          if (!messageContext) {
            continue
          }

          this._logger.log(LogLevel.Major, messageContext, section.title, faq.id)

          section.questions = section.questions.filter((questionItem) => questionItem.id !== faq.id)
        }
      }
    }
  }
}
