export interface BaserowLinkedField {
  id: number
  value: string
}

export interface BaserowProject {
  id: number
  slug?: string
  title?: string
  Titre?: string
  'Thématique principale'?: BaserowLinkedField[]
  Prio?: number | string
  'Prios spécifiques'?: string
}

export type ProjectRow = BaserowProject & {
  currentPriority: number
  theme: string
}
