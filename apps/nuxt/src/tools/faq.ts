import { Marked } from '@/tools/marked'
import { FaqQuestionItem } from '@tee/data'
import { defineQuestion } from '@unhead/schema-org/vue'

export class Faq {
  public static getDefineQuestions(questions: FaqQuestionItem[]) {
    const defineQuestions = []
    for (const question of questions) {
      defineQuestions.push(
        defineQuestion({
          name: Marked.toHtml(question.question, false, false),
          acceptedAnswer: Marked.toHtml(question.answer, true, false)
        })
      )
    }

    return defineQuestions
  }
}
