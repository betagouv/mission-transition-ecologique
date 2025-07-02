import { Color } from '@/types'

export enum FaqPage {
  Home = 'home',
  CatalogProject = 'catalog-project',
  CatalogProgram = 'catalog-program',
  Faq = 'faq'
}

export interface FaqItem {
  title: string
  color: Color
  questions: QuestionItem[]
}

interface QuestionItem {
  question: string
  answer: string
}

export type FaqType = {
  [key in FaqPage]?: FaqItem[]
}
