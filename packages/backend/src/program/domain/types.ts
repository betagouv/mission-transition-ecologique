import {
  QuestionnaireRoute,
  StructureSize,
  BuildingProperty,
  WasteSorting,
  WastePriority
} from '../../../../common/src/questionnaire/types'

import { Objective, Sector, YesNo } from '@tee/data/src/type/publicodesTypes'
export { type Program } from '@tee/data/src/type/program'
export { type Operators } from '@tee/data/src/generated/program'

export interface QuestionnaireData {
  questionnaire_route: QuestionnaireRoute
  structure_size: StructureSize
  sector?: Sector
  priority_objective?: Objective
  strategy_audits?: YesNo
  structure_building_property?: BuildingProperty
  energy_reduction_priority?: YesNo
  wastes_materials_priority?: YesNo
  sustainable_mobility_priority?: string // TODO
  strategy_audits_select?: string // TODO broken as before ?
  wastes_sorting?: WasteSorting
  wastes_priority?: WastePriority
  water_priority?: YesNo // TODO replace all "priorities" by "objective"

  siret?: string
  // below is data extracted from the SIREN database
  codeNAF?: string
  codeNAF1?: string
  ville?: string
  codePostal?: string
  region?: string
  denomination?: string
  secteur?: string
}
