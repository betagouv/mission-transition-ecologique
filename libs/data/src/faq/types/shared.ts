import { Color } from '@tee/common'

export enum FaqPage {
  Home = 'home',
  CatalogProject = 'catalog-project',
  CatalogProgram = 'catalog-program',
  Faq = 'faq'
}

export interface FaqSectionType {
  title: string
  color: Color
  questions: QuestionItem[]
}

export interface QuestionItem {
  id: number
  question: string
  answer: string
}
