import { ReplacerBaserow } from '../../replacerBaserow'
import { BaserowFaq, BaserowFaqs } from '../../types'
import { DataProject } from '../../../../project/types/domain'
import { FaqProjectType } from '../../../../faq/types/domain'
import { FaqPage, QuestionItem } from '../../../../faq/types/shared'
import { AbstractFaqConverter } from './abstractFaqConverter'

export class FaqProjectConverter extends AbstractFaqConverter {
  toDomain(baserowFaqs: BaserowFaq[], projects: DataProject[]): FaqProjectType {
    const faqsStructured = this._buildStructuredFaqs(baserowFaqs, projects)

    const faqs: FaqProjectType = {}
    for (const projectId in faqsStructured) {
      this._sortFaqs(faqsStructured[projectId].faqs)
      const questions: QuestionItem[] = []
      for (const faq of faqsStructured[projectId].faqs) {
        questions.push(this._mappedFaq(faq))
      }
      faqs[projectId] = questions
    }

    return faqs
  }

  private _buildStructuredFaqs(baserowFaqs: BaserowFaq[], projects: DataProject[]) {
    const faqs: { [key: number]: BaserowFaqs } = {}
    for (const baserowFaq of baserowFaqs) {
      const project = ReplacerBaserow.linkObjectByTableData<DataProject, true>(baserowFaq.Projet, projects, true)

      if (!this._isFaqProject(project, baserowFaq)) {
        continue
      }

      if (!faqs[project.id]) {
        faqs[project.id] = { faqs: [] }
      }

      faqs[project.id].faqs.push(baserowFaq)
    }

    return faqs
  }

  private _isFaqProject(project: DataProject | undefined, baserowFaq: BaserowFaq): project is DataProject {
    if (!project) {
      if (!baserowFaq.Page) {
        this._logNotLinkedToPageOrProject(baserowFaq)
      }

      return false
    }

    if (baserowFaq.Page) {
      this._logLinkedToProjectAndPage(ReplacerBaserow.linkObjectByValue(baserowFaq.Page) as FaqPage, baserowFaq)
    }

    return true
  }
}
