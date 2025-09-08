import ConfigBaserow from '../../configBaserow'
import { AbstractBaserow } from './abstractBaserow'
import { BaserowFaq, BaserowFaqSection } from './types'

export class FaqBaserow extends AbstractBaserow {
  private readonly _faqTableId = ConfigBaserow.FAQ_ID
  private readonly _faqSectionTableId = ConfigBaserow.FAQ_SECTION_ID

  async getFaqs(): Promise<{ baserowFaqs: BaserowFaq[]; baserowFaqSections: BaserowFaqSection[] }> {
    return {
      baserowFaqs: await this._getTableData<BaserowFaq>(this._faqTableId),
      baserowFaqSections: await this._getTableData<BaserowFaqSection>(this._faqSectionTableId)
    }
  }
}
