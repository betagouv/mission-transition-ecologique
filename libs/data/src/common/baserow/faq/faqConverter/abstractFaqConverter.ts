import { ReplacerBaserow } from '../../replacerBaserow'
import { BaserowFaq } from '../../types'
import { LoggerInterface, LoggerType, LogLevel } from '../../../logger/types'
import { FaqPage, QuestionItem } from '../../../../faq/types/shared'

export abstract class AbstractFaqConverter {
  constructor(private _logger: LoggerInterface) {}

  protected _sortFaqs(faqs: BaserowFaq[]) {
    faqs.sort((a, b) => a.order - b.order)
  }

  protected _mappedFaq(faq: BaserowFaq): QuestionItem {
    return {
      id: faq.id,
      question: faq.Question,
      answer: faq['Réponse']
    }
  }

  protected _logLinkedToProjectAndPage(page: FaqPage, baserowFaq: BaserowFaq) {
    this._log(
      `FAQ lié à une page statique: ${page} et à un projet : ${ReplacerBaserow.linkObjectsByValues(baserowFaq.Projet).toString()}`,
      baserowFaq
    )
  }

  protected _logNotLinkedToPageOrProject(baserowFaq: BaserowFaq) {
    this._log('FAQ non lié à une page statique ni à un projet', baserowFaq)
  }

  private _log(message: string, baserowFaq: BaserowFaq) {
    this._logger.log(LogLevel.Critic, message, `FAQ ID Baserow: ${baserowFaq.id}`, baserowFaq.id, baserowFaq.id, LoggerType.Faq)
  }
}
