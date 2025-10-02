import { Color } from '@tee/common'
import { LoggerInterface, LogLevel } from '../common/logger/types'
import { FaqFilterInterface, FaqPageType } from './types/domain'
import { FaqPage, QuestionItem } from './types/shared'
import { LinkValidator } from '../common/validators/linkValidator'

export class FaqFilter implements FaqFilterInterface {
  constructor(private _logger: LoggerInterface) {}

  public async byValidity(faqs: FaqPageType) {
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

        section.questions = await this.byValidatedQuestions(section.questions)
      }
    }
  }

  public byValidatedQuestions = async (questions: QuestionItem[]) => {
    const validatedQuestions: QuestionItem[] = []
    for (const question of questions) {
      try {
        if (!question.question?.trim()) {
          throw new Error(`Question non fournie`)
        }

        if (!question.answer?.trim()) {
          throw new Error(`Réponse non fournie`)
        }

        await LinkValidator.logInvalidLinks(question.answer, this._logger, LogLevel.Major, 'Réponse', question.answer, question.id)
        validatedQuestions.push(question)
      } catch (error: unknown) {
        if (error instanceof Error) {
          this._logger.log(LogLevel.Major, error.message, question.id.toString(), question.id, {
            question: question.question,
            reponse: question.answer
          })
        }
      }
    }

    return validatedQuestions
  }
}
