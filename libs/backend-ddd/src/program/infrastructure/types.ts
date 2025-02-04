import { PublicodesKeys, PublicodeObjective } from '@tee/common'
import { Operators, PublicodesCondition } from '@tee/data'
export interface PublicodesInputData {
  [PublicodesKeys.CodeNAF]?: string
  [PublicodesKeys.CodeNAF1]?: string
  [PublicodesKeys.ValidityStart]?: string
  [PublicodesKeys.ValidityEnd]?: string
  [PublicodesKeys.CurrentDate]: string
  [PublicodesKeys.Workforce]?: number
  région?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export enum PublicodesQuestionnaireRoute {
  NoSpecificGoal = '"je ne sais pas par où commencer"'
}

export type ObjectivePublicodeData = {
  [key in PublicodesCondition]: PublicodeObjective[]
}

export type ConditionalYaml = {
  'une de ces conditions'?: string[]
  'toutes ces conditions'?: string[]
  'opérateur de contact': Operators
  'autres opérateurs': Operators[]
  url: string
  'Montant du dispositif': string
  'Durée du dispositif': string
  'Eligibilité taille': string
  "autres critères d'éligibilité": string[]
}
