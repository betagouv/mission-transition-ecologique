import { AbstractBaserow } from '../../src/common/baserow/abstractBaserow'
import { BaserowFaq, BaserowFaqSection, FaqBaserowInterface } from '../../src/common/baserow/types'
import * as faqFixtures from './fixtures/faq.fixtures'
import * as faqSection from './fixtures/faqSection.fixtures'

export class FaqBaserowMock extends AbstractBaserow implements FaqBaserowInterface {
  async getFaqs(): Promise<{ baserowFaqs: BaserowFaq[]; baserowFaqSections: BaserowFaqSection[] }> {
    return {
      baserowFaqs: faqFixtures.faqBaserow as unknown as BaserowFaq[],
      baserowFaqSections: faqSection.faqSectionBaserow as unknown as BaserowFaqSection[]
    }
  }
}
