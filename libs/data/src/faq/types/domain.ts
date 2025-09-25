import { DataProject } from '../../project/types/domain'
import { FaqPage, FaqSectionType } from './shared'
import { BaserowFaq, BaserowFaqSection } from '../../common/baserow/types'

export interface FaqConverterInterface {
  toDomainByPages(baserowFaqs: BaserowFaq[], baserowFaqSections: BaserowFaqSection[]): FaqType
  toDomainByProjects(baserowFaqs: BaserowFaq[], baserowFaqSections: BaserowFaqSection[], projects: DataProject[]): FaqType
}

export interface FaqFilterInterface {
  byActive(baserowFaqs: BaserowFaq[]): BaserowFaq[]
  byValidity(faqs: FaqType): Promise<void>
}

export type FaqType = {
  [key in FaqPage | number]?: FaqSectionType[]
}
