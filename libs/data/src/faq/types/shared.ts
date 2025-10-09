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
  questions: FaqQuestionItem[]
}

export interface FaqQuestionItem {
  id: number
  question: string
  answer: string
}
