import { FaqType } from './shared'
import { BaserowFaq, BaserowFaqSection } from '../../common/baserow/types'

export interface FaqConverterInterface {
  toDomain(baserowFaqs: BaserowFaq[], baserowFaqSections: BaserowFaqSection[]): FaqType
}

export interface FaqFilterInterface {
  byActive(baserowFaqs: BaserowFaq[]): BaserowFaq[]
  byValidity(faqs: FaqType): Promise<void>
}
