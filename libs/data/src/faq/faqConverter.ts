import { Color } from '@tee/common'
import { ReplacerBaserow } from '../common/baserow/replacerBaserow'
import { BaserowFaq, BaserowFaqSection, FaqItemStructured, FaqStructured } from '../common/baserow/types'
import { LoggerInterface, LogLevel } from '../common/logger/types'
import { FaqConverterInterface } from './types/domain'
import { FaqPage, FaqSectionType, FaqType, QuestionItem } from './types/shared'

export class FaqConverter implements FaqConverterInterface {
  constructor(private _logger: LoggerInterface) {}

  toDomain(baserowFaqs: BaserowFaq[], baserowFaqSections: BaserowFaqSection[]) {
    const faqs = this._buildStructuredFaqs(baserowFaqs, baserowFaqSections)
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

  private _buildStructuredFaqs(baserowFaqs: BaserowFaq[], baserowFaqSections: BaserowFaqSection[]) {
    const faqs: FaqStructured = {}
    for (const baserowFaq of baserowFaqs) {
      const page = this._mappedPageName(ReplacerBaserow.replaceLinkObjectByValue(baserowFaq.Page) as string)
      if (!page) {
        this._logger.log(
          LogLevel.Critic,
          `Page de destination pour la question de FAQ non reconnue`,
          `FAQ ID Baserow: ${baserowFaq.id}`,
          baserowFaq.id,
          baserowFaq.Page
        )
        continue
      }

      const faqSection = ReplacerBaserow.replaceLinkObjectByTableData<BaserowFaqSection, true>(baserowFaq.Section, baserowFaqSections, true)

      if (!faqSection) {
        continue
      }

      if (!faqs[page]) {
        faqs[page] = [{ ...faqSection, faqs: [baserowFaq] }]
        continue
      } else if (!faqs[page]?.find((section) => section.id === faqSection.id)) {
        faqs[page]?.push({ ...faqSection, faqs: [baserowFaq] })
        continue
      }

      for (const faqSectionItem of faqs[page]) {
        if (faqSectionItem.id === faqSection.id) {
          faqSectionItem.faqs.push(baserowFaq)
          break
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

  private _buildDomainFaqs(faqsStructured: FaqStructured): FaqType {
    const faqs: FaqType = {}
    for (const page in faqsStructured) {
      const faqItemsStructured = faqsStructured[page as FaqPage]
      if (!faqItemsStructured) {
        continue
      }

      if (!faqs[page as FaqPage]) {
        faqs[page as FaqPage] = []
      }

      for (const index in faqItemsStructured) {
        if (!faqItemsStructured[index]) {
          continue
        }

        const section = this._mappedFaqSection(faqItemsStructured[index])
        faqs[page as FaqPage]?.push(section)
        for (const faq of faqItemsStructured[index].faqs) {
          section.questions.push(this._mappedFaq(faq))
        }
      }
    }

    return faqs
  }

  private _mappedFaqSection(faqSection: FaqItemStructured): FaqSectionType {
    return {
      title: faqSection.Titre,
      color: ReplacerBaserow.replaceLinkObjectByValue(faqSection.Couleur) as Color,
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
}
