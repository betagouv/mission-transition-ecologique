import { Sector, PublicodesKeys } from '../../../../common/src/questionnaire/types'

export interface PublicodesInputData {
  [PublicodesKeys.CodeNAF]?: string
  [PublicodesKeys.ValidityStart]?: string
  [PublicodesKeys.ValidityEnd]?: string
  [PublicodesKeys.CurrentDate]: string
  [PublicodesKeys.QuestionnaireRoute]?: PublicodesQuestionnaireRoute
  [PublicodesKeys.Workforce]: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export enum PublicodesQuestionnaireRoute {
  NoSpecificGoal = '"je ne sais pas par où commencer"',
  SpecificGoal = '"objectif précis"'
}

export const SectorToNAFSection = {
  [Sector.Craftsmanship]: ['C', 'F', 'G'],
  [Sector.Industry]: ['B', 'C', 'D', 'E'],
  [Sector.Tourism]: ['I'],
  [Sector.Tertiary]: ['G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'],
  [Sector.Agriculture]: ['A'],
  [Sector.Other]: ['D', 'E', 'F', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']
}

export const NAF1Letters = [...'ABCDEFGHIJKLMNOPQRSTU'] as const

// NAF CODES
// Associates a NAF1 (composed of 1 letter) to its expected publicode variable
// export const NAF1ToVar = (letter: string): string => Entreprise.CodeNAF1 + letter

// // publicodes variable initialization to "non"
// export const codesNAF1: { [p: string]: YesNo } = Object.fromEntries(NAF1Letters.map((l) => [NAF1ToVar(l), YesNo.No]))
