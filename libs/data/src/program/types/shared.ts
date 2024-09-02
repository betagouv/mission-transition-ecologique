export enum ProgramAidType {
  study = 'étude',
  train = 'formation',
  fund = 'financement',
  loan = 'prêt',
  tax = 'avantage fiscal'
}

export enum ProgramOperatorType {
  ADEME = 'ADEME',
  ASP = 'ASP',
  BPI = 'Bpifrance',
  CCI = 'CCI',
  CMA = 'CMA',
  DDFIP = 'DDFIP',
  LAPOSTE = 'La Poste',
  MTES = 'Ministère de la Transition Écologique et Solidaire',
  ORACE = 'ORACE',
  BREIZHFAB = 'Breizh Fab',
  ECOCO2 = 'EcoCO2'
}

import { Dispositif as ProgramWithoutId } from '../../generated/program'

export interface ProgramTypeTest extends Omit<ProgramWithoutId, 'objectifs'> {
  id: string
  "nature de l'aide": ProgramAidType
  objectifs: ProgramObjective[]
}

interface ProgramObjectiveLink {
  lien: string
  texte: string
}

interface ProgramObjective {
  description: string
  liens: ProgramObjectiveLink[]
}
