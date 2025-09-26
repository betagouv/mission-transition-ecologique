import { Color } from '@tee/common'
import { ReplacerBaserow } from '../common/baserow/replacerBaserow'
import { BaserowFaq, BaserowFaqSection, FaqItemStructured, FaqStructured } from '../common/baserow/types'
import { LoggerInterface, LoggerType, LogLevel } from '../common/logger/types'
import { DataProject } from '../project/types/domain'
import { FaqConverterInterface, FaqType } from './types/domain'
import { FaqPage, FaqSectionType, QuestionItem } from './types/shared'

export class FaqConverter implements FaqConverterInterface {
  constructor(private _logger: LoggerInterface) {}

  toDomainByPages(baserowFaqs: BaserowFaq[], baserowFaqSections: BaserowFaqSection[]) {
    const faqs = this._buildStructuredFaqsByPages(baserowFaqs, baserowFaqSections)
    this._sort(faqs)
    return this._buildDomainFaqs(faqs)
  }

  toDomainByProjects(baserowFaqs: BaserowFaq[], baserowFaqSections: BaserowFaqSection[], projects: DataProject[]) {
    const faqs = this._buildStructuredFaqsByProjects(baserowFaqs, baserowFaqSections, projects)
    this._sort(faqs)
    return this._buildDomainFaqs(faqs)
  }

  private _sort(faqsStructured: FaqStructured) {
    for (const page in faqsStructured) {
      const faqItemsStructured = faqsStructured[page as FaqPage]
      if (!faqItemsStructured) {
        continue
      }
      this._sortFaqSections(faqItemsStructured)
      for (const faqSection of faqItemsStructured) {
        this._sortFaqs(faqSection.faqs)
      }
    }
  }

  private _sortFaqSections(faqSections: FaqItemStructured[]) {
    faqSections.sort((a, b) => a.order - b.order)
  }

  private _sortFaqs(faqs: BaserowFaq[]) {
    faqs.sort((a, b) => a.order - b.order)
  }

  private _buildStructuredFaqsByPages(baserowFaqs: BaserowFaq[], baserowFaqSections: BaserowFaqSection[]) {
    const faqs: FaqStructured = {}
    for (const baserowFaq of baserowFaqs) {
      const page = this._mappedPageName(ReplacerBaserow.linkObjectByValue(baserowFaq.Page) as string)

      if (!this._isFaqPage(page, baserowFaq)) {
        continue
      }

      this._buildStructuredFaq(page, baserowFaq, baserowFaqSections, faqs)
    }

    return faqs
  }

  private _buildStructuredFaqsByProjects(baserowFaqs: BaserowFaq[], baserowFaqSections: BaserowFaqSection[], projects: DataProject[]) {
    const faqs: FaqStructured = {}
    for (const baserowFaq of baserowFaqs) {
      const project = ReplacerBaserow.linkObjectByTableData<DataProject, true>(baserowFaq.Projet, projects, true)

      if (!this._isFaqProject(project, baserowFaq)) {
        continue
      }

      this._buildStructuredFaq(project.id, baserowFaq, baserowFaqSections, faqs)
    }

    return faqs
  }

  private _buildStructuredFaq(key: FaqPage | number, baserowFaq: BaserowFaq, baserowFaqSections: BaserowFaqSection[], faqs: FaqStructured) {
    const faqSection = ReplacerBaserow.linkObjectByTableData<BaserowFaqSection, true>(baserowFaq.Section, baserowFaqSections, true)

    if (!faqSection) {
      return
    }

    if (!faqs[key]) {
      faqs[key] = [{ ...faqSection, faqs: [baserowFaq] }]
      return
    } else if (!faqs[key]?.find((section) => section.id === faqSection.id)) {
      faqs[key]?.push({ ...faqSection, faqs: [baserowFaq] })
      return
    }

    for (const faqSectionItem of faqs[key]) {
      if (faqSectionItem.id === faqSection.id) {
        faqSectionItem.faqs.push(baserowFaq)
        break
      }
    }
  }

  private _buildDomainFaqs(faqsStructured: FaqStructured): FaqType {
    const faqs: FaqType = {}
    for (const key in faqsStructured) {
      const faqItemsStructured = faqsStructured[key]
      if (!faqItemsStructured) {
        continue
      }

      if (!faqs[key]) {
        faqs[key] = []
      }

      for (const index in faqItemsStructured) {
        if (!faqItemsStructured[index]) {
          continue
        }

        const section = this._mappedFaqSection(faqItemsStructured[index])
        faqs[key]?.push(section)
        for (const faq of faqItemsStructured[index].faqs) {
          section.questions.push(this._mappedFaq(faq))
        }
      }
    }

    return faqs
  }

  private _mappedPageName(name: string) {
    switch (name) {
      case 'Accueil':
        return FaqPage.Home
      case 'Liste Dispositifs':
        return FaqPage.CatalogProgram
      case 'Liste Projets':
        return FaqPage.CatalogProject
      case 'FAQ':
        return FaqPage.Faq
      default:
        return undefined
    }
  }

  private _mappedFaqSection(faqSection: FaqItemStructured): FaqSectionType {
    return {
      title: faqSection.Titre,
      color: ReplacerBaserow.linkObjectByValue(faqSection.Couleur) as Color,
      questions: []
    }
  }

  private _mappedFaq(faq: BaserowFaq): QuestionItem {
    return {
      id: faq.id,
      question: faq.Question,
      answer: faq['Réponse']
    }
  }

  private _isFaqPage(page: FaqPage | undefined, baserowFaq: BaserowFaq): page is FaqPage {
    if (!page) {
      if (baserowFaq.Projet.length === 0) {
        this._logNotLinkedToPageOrProject(baserowFaq)
      }

      return false
    }

    if (baserowFaq.Projet.length > 0) {
      this._logLinkedToProjectAndPage(page, baserowFaq)

      return false
    }

    return true
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

      return false
    }

    return true
  }

  private _logLinkedToProjectAndPage(page: FaqPage, baserowFaq: BaserowFaq) {
    this._log(
      `FAQ lié à une page statique: ${page} et à un projet : ${ReplacerBaserow.linkObjectsByValues(baserowFaq.Projet).toString()}`,
      baserowFaq
    )
  }

  private _logNotLinkedToPageOrProject(baserowFaq: BaserowFaq) {
    this._log('FAQ non lié à une page statique ni à un projet', baserowFaq)
  }

  private _log(message: string, baserowFaq: BaserowFaq) {
    this._logger.log(LogLevel.Critic, message, `FAQ ID Baserow: ${baserowFaq.id}`, baserowFaq.id, baserowFaq.id, LoggerType.Faq)
  }
}
