import { DataProject } from '../../project/types/domain'
import { FaqPage, FaqSectionType, QuestionItem } from './shared'

export interface FaqRepositoryInterface {
  getFaqs(): Promise<FaqPageType>
  getProjectsFaqs(projects: DataProject[]): Promise<FaqProjectType>
}

export interface FaqFilterInterface {
  byValidity(faqs: FaqPageType): Promise<void>
  byValidatedQuestions(questions: QuestionItem[]): Promise<QuestionItem[]>
}

export type FaqPageType = {
  [key in FaqPage]?: FaqSectionType[]
}

export type FaqProjectType = {
  [key: number]: QuestionItem[]
}
