import ConfigBaserow from '../../../config/configBaserow'
import { FaqPageType, FaqProjectType, FaqRepositoryInterface } from '../../../faq/types/domain'
import { DataProject } from '../../../project/types/domain'
import { LoggerInterface } from '../../logger/types'
import { AbstractBaserow } from '../abstractBaserow'
import { FilterBaserow } from '../filterBaserow'
import { BaserowFaq, BaserowFaqSection } from '../types'
import { FaqPageConverter } from './faqConverter/faqPageConverter'
import { FaqProjectConverter } from './faqConverter/faqProjectConverter'

export class FaqBaserow extends AbstractBaserow implements FaqRepositoryInterface {
  private readonly _faqTableId = ConfigBaserow.FAQ_ID
  private readonly _faqSectionTableId = ConfigBaserow.FAQ_SECTION_ID

  constructor(private _logger: LoggerInterface) {
    super()
  }

  async getFaqs(): Promise<FaqPageType> {
    const baserowData = {
      baserowFaqs: await this._getTableData<BaserowFaq>(this._faqTableId, new FilterBaserow('AND').withIsActive('Actif')),
      baserowFaqSections: await this._getTableData<BaserowFaqSection>(this._faqSectionTableId)
    }

    return new FaqPageConverter(this._logger).toDomain(baserowData.baserowFaqs, baserowData.baserowFaqSections)
  }

  async getProjectsFaqs(projects: DataProject[]): Promise<FaqProjectType> {
    const baserowFaqs = await this._getTableData<BaserowFaq>(
      this._faqTableId,
      new FilterBaserow('AND').withNotEmpty('Projet').withIsActive('Actif')
    )

    return new FaqProjectConverter(this._logger).toDomain(baserowFaqs, projects)
  }
}
