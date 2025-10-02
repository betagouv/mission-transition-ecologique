import { Color } from '@tee/common'
import { ReplacerBaserow } from '../../replacerBaserow'
import { BaserowFaq, BaserowFaqSection, FaqItemStructured, FaqPagesStructured } from '../../types'
import { FaqPageType } from '../../../../faq/types/domain'
import { FaqPage, FaqSectionType } from '../../../../faq/types/shared'
import { AbstractFaqConverter } from './abstractFaqConverter'

export class FaqPageConverter extends AbstractFaqConverter {
  toDomain(baserowFaqs: BaserowFaq[], baserowFaqSections: BaserowFaqSection[]) {
    const faqs = this._buildStructuredFaqs(baserowFaqs, baserowFaqSections)
    this._sort(faqs)
    return this._buildDomainFaqs(faqs)
  }

  private _sort(faqsStructured: FaqPagesStructured) {
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

  private _buildStructuredFaqs(baserowFaqs: BaserowFaq[], baserowFaqSections: BaserowFaqSection[]) {
    const faqs: FaqPagesStructured = {}
    for (const baserowFaq of baserowFaqs) {
      const page = this._mappedPageName(ReplacerBaserow.linkObjectByValue(baserowFaq.Page) as string)

      if (!this._isFaqPage(page, baserowFaq)) {
        continue
      }

      this._buildStructuredFaqWithSection(page, baserowFaq, baserowFaqSections, faqs)
    }

    return faqs
  }

  private _buildStructuredFaqWithSection(
    page: FaqPage,
    baserowFaq: BaserowFaq,
    baserowFaqSections: BaserowFaqSection[],
    faqs: FaqPagesStructured
  ) {
    const faqSection = ReplacerBaserow.linkObjectByTableData<BaserowFaqSection, true>(baserowFaq.Section, baserowFaqSections, true)

    if (!faqSection) {
      return
    }

    if (!faqs[page]) {
      faqs[page] = [{ ...faqSection, faqs: [baserowFaq] }]
      return
    } else if (!faqs[page]?.find((section) => section.id === faqSection.id)) {
      faqs[page]?.push({ ...faqSection, faqs: [baserowFaq] })
      return
    }

    for (const faqSectionItem of faqs[page]) {
      if (faqSectionItem.id === faqSection.id) {
        faqSectionItem.faqs.push(baserowFaq)
        break
      }
    }
  }

  private _buildDomainFaqs(faqsStructured: FaqPagesStructured): FaqPageType {
    const faqs: FaqPageType = {}
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
}
