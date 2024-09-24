import { ThemeId, ProgramOperatorType, ProgramAidType, FiltersKeys, Dispositif as ProgramWithoutId, Override } from '@/types'

interface ProgramObjectiveLink {
  lien: string
  texte: string
}

interface ProgramObjective {
  description: string
  liens: ProgramObjectiveLink[]
}

export type FiltersProgramData = {
  [FiltersKeys.Theme]?: ThemeId[]
}

export type ProgramType = Override<
  ProgramWithoutId,
  {
    id: string
    "nature de l'aide": ProgramAidType
    'opérateur de contact': ProgramOperatorType
    objectifs: ProgramObjective[]
    filters: FiltersProgramData
  }
>
