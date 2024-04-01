import { Sector } from '@tee/data/src/type/publicodesTypes'

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

export enum PublicodesKeys {
  ValidityStart = 'dispositif . début de validité',
  ValidityEnd = 'dispositif . fin de validité',
  QuestionnaireRoute = 'questionnaire . parcours',
  CurrentDate = 'date du jour',
  SectorActivity = "entreprise . secteur d'activité . est ",
  CodeNAF = 'entreprise . code NAF',
  CodeNAF1 = 'entreprise . code NAF niveau 1 . est ',
  Workforce = 'entreprise . effectif',
  BuildingOwner = 'entreprise . est propriétaire de ses locaux',
  Goal = 'questionnaire . objectif prioritaire . est'
}

export const SectorToNafSection = {
  [Sector.Craftsmanship]: ['C', 'F', 'G'],
  [Sector.Industry]: ['B', 'C', 'D', 'E'],
  [Sector.Tourism]: ['I'],
  [Sector.Tertiary]: ['G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'],
  [Sector.Agriculture]: ['A'],
  [Sector.Other]: ['D', 'E', 'F', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']
}
