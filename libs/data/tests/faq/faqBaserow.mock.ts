import { BaserowFaq, BaserowFaqSection, FaqBaserowInterface } from '../../src/common/baserow/types'
import * as faqFixtures from './fixtures/faq.fixtures'
import * as faqSection from './fixtures/faqSection.fixtures'

export class FaqBaserowMock implements FaqBaserowInterface {
  async getFaqs(): Promise<{ baserowFaqs: BaserowFaq[]; baserowFaqSections: BaserowFaqSection[] }> {
    return {
      baserowFaqs: faqFixtures.faqBaserow as unknown as BaserowFaq[],
      baserowFaqSections: faqSection.faqSectionBaserow as unknown as BaserowFaqSection[]
    }
  }

  getProjectsFaqs(): Promise<{ baserowFaqs: BaserowFaq[]; baserowFaqSections: BaserowFaqSection[] }> {
    return Promise.resolve({ baserowFaqSections: [], baserowFaqs: [] })
  }
}
