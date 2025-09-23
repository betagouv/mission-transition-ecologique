import { Color } from '@tee/common'
import { LoggerInterface, LogLevel } from '../common/logger/types'
import { FaqFilterInterface, FaqType } from './types/domain'
import { FaqPage } from './types/shared'
import { BaserowFaq } from '../common/baserow/types'
import { LinkValidator } from '../common/validators/linkValidator'

export class FaqFilter implements FaqFilterInterface {
  constructor(private _logger: LoggerInterface) {}

  public byActive(baserowFaqs: BaserowFaq[]) {
    return baserowFaqs.filter((faq) => faq.Actif)
  }

  public async byValidity(faqs: FaqType) {
    for (const page in faqs) {
      const faqSections = faqs[page as FaqPage]

      if (!faqSections) {
        continue
      }

      for (const section of faqSections) {
        if (!Object.values(Color).includes(section.color) && section.questions.length > 0) {
          const question = section.questions[0]
          this._logger.log(LogLevel.Major, `Couleur de section non reconnue`, section.title, question.id, section.color)
        }

        for (const faq of section.questions) {
          try {
            if (!faq.question?.trim()) {
              throw new Error(`Question non fournie`)
            }

            if (!faq.answer?.trim()) {
              throw new Error(`Réponse non fournie`)
            }

            await LinkValidator.logInvalidLinks(faq.answer, this._logger, LogLevel.Major, 'Réponse', faq.answer, faq.id)
          } catch (error: unknown) {
            if (error instanceof Error) {
              this._logger.log(LogLevel.Major, error.message, section.title, faq.id)
              section.questions = section.questions.filter((questionItem) => questionItem.id !== faq.id)
            }
          }
        }
      }
    }
  }
}
